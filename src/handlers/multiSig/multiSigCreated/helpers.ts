import {
  AnyColonyClient,
  AnyMultisigPermissionsClient,
  AnyOneTxPaymentClient,
  AnyStagedExpenditureClient,
  AnyStakedExpenditureClient,
} from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { GraphQLFnReturn, mutate, query } from '~amplifyClient';
import { SIMPLE_DECISIONS_ACTION_CODE } from '~constants';
import {
  ColonyMultiSig,
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
  CreateColonyMultiSigDocument,
  CreateColonyMultiSigInput,
  CreateColonyMultiSigMutationVariables,
  GetDomainByNativeSkillIdDocument,
  GetDomainByNativeSkillIdQuery,
  GetDomainByNativeSkillIdQueryVariables,
} from '~graphql';
import networkClient from '~networkClient';
import { ColonyOperations, ContractEvent } from '~types';
import {
  getDomainDatabaseId,
  getMultiSigClient,
  output,
  verbose,
} from '~utils';
import { getMultiSigDatabaseId } from '../helpers';

export interface SimpleTransactionDescription {
  name: ColonyOperations.SimpleDecision;
}

interface MultiSigActionClients {
  colonyClient?: AnyColonyClient | null;
  oneTxPaymentClient?: AnyOneTxPaymentClient | null;
  stakedExpenditureClient?: AnyStakedExpenditureClient | null;
  stagedExpenditureClient?: AnyStagedExpenditureClient | null;
}

export const parseMultiSigAction = (
  action: string,
  clients: MultiSigActionClients,
): TransactionDescription | SimpleTransactionDescription | undefined => {
  if (action === SIMPLE_DECISIONS_ACTION_CODE) {
    return {
      name: ColonyOperations.SimpleDecision,
    };
  }

  for (const key in clients) {
    const client = clients[key as keyof MultiSigActionClients];
    if (!client) {
      continue;
    }
    // Return the first time a client can successfully parse the motion
    try {
      return client.interface.parseTransaction({
        data: action,
      });
    } catch {
      continue;
    }
  }

  verbose(`Unable to parse multiSig: ${action}`);
  return undefined;
};

const createColonyMultiSig = async (
  motionData: CreateColonyMultiSigInput,
): Promise<void> => {
  await mutate<
    CreateColonyMultiSigInput,
    CreateColonyMultiSigMutationVariables
  >(CreateColonyMultiSigDocument, {
    input: {
      ...motionData,
    },
  });
};

const createColonyAction = async (
  actionData: CreateColonyActionInput,
  blockTimestamp: number,
): Promise<void> => {
  await mutate<CreateColonyActionMutation, CreateColonyActionMutationVariables>(
    CreateColonyActionDocument,
    {
      input: {
        ...actionData,
        createdAt: new Date(blockTimestamp * 1000).toISOString(),
      },
    },
  );
};

interface GetMultiSigDataArgs {
  transactionHash: string;
  multiSigId: BigNumber;
  domainId: number;
  requiredPermissions: number;
  multiSigClient: AnyMultisigPermissionsClient;
  colonyAddress: string;
  isDecision?: boolean;
}

export const getMultiSigData = async ({
  transactionHash,
  multiSigId,
  domainId,
  requiredPermissions,
  multiSigClient,
  colonyAddress,
  isDecision = false,
}: GetMultiSigDataArgs): Promise<ColonyMultiSig> => {
  const { chainId } = await multiSigClient.provider.getNetwork();
  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigClient.address,
    multiSigId,
  );

  return {
    id: multiSigDatabaseId,
    nativeMultiSigId: multiSigId.toString(),
    multiSigDomainId: getDomainDatabaseId(colonyAddress, domainId),
    nativeMultiSigDomainId: domainId.toString(),
    requiredPermissions,
    transactionHash,
    isExecuted: false,
    isRejected: false,
    isDecision,
  };
};

const getDomainIdByNativeSkillId = async (
  nativeSkillId: number,
): Promise<number | null> => {
  const result = await query<
    GetDomainByNativeSkillIdQuery,
    GetDomainByNativeSkillIdQueryVariables
  >(GetDomainByNativeSkillIdDocument, {
    nativeSkillId,
  });

  if (result?.data?.getDomainByNativeSkillId?.items[0]) {
    return result?.data?.getDomainByNativeSkillId?.items[0].nativeId;
  }

  return null;
};

export const createMultiSigInDB = async (
  {
    transactionHash,
    blockNumber,
    logIndex,
    colonyAddress,
    args: { motionId: multiSigId },
    timestamp,
  }: ContractEvent,
  {
    ...input
  }: Omit<
    CreateColonyActionInput,
    | 'id'
    | 'colonyId'
    | 'showInActionsList'
    | 'isMultiSig'
    | 'multiSigId'
    | 'initiatorAddress'
    | 'blockNumber'
    | 'rootHash'
    | 'fromDomainId'
  >,
): Promise<GraphQLFnReturn<CreateColonyMultiSigInput> | undefined> => {
  if (!colonyAddress) {
    return;
  }

  const multiSigClient = await getMultiSigClient(colonyAddress);

  if (!multiSigClient) {
    return;
  }
  const motion = await multiSigClient.getMotion(multiSigId);

  const domainId = await getDomainIdByNativeSkillId(
    motion.domainSkillId.toNumber(),
  );

  if (domainId === null) {
    output(`Cannot get domain for skillId: ${motion.domainSkillId.toNumber()}`);
    return;
  }

  const requiredPermissions = BigNumber.from(
    motion.requiredPermissions,
  ).toNumber();

  const multiSigData = await getMultiSigData({
    transactionHash,
    multiSigClient,
    multiSigId,
    domainId,
    requiredPermissions,
    colonyAddress,
    isDecision: !!input.colonyDecisionId,
  });

  const rootHash = await networkClient.getReputationRootHash({
    blockTag: blockNumber,
  });

  const actionData = {
    id: transactionHash,
    colonyId: colonyAddress,
    isMultiSig: true,
    multiSigId: multiSigData.id,
    showInActionsList: false,
    initiatorAddress: motion.creator,
    blockNumber,
    rootHash,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    ...input,
  };

  await Promise.all([
    createColonyMultiSig(multiSigData),
    createColonyAction(actionData, timestamp),
  ]);
};
