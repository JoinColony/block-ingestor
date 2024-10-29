import { AnyMultisigPermissionsClient } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { GraphQLFnReturn, mutate, query } from '~amplifyClient';
import {
  ColonyMultiSig,
  CreateColonyActionInput,
  CreateColonyMultiSigDocument,
  CreateColonyMultiSigInput,
  CreateColonyMultiSigMutationVariables,
  GetDomainByNativeSkillIdDocument,
  GetDomainByNativeSkillIdQuery,
  GetDomainByNativeSkillIdQueryVariables,
} from '~graphql';
import networkClient from '~networkClient';
import { getChainId } from '~provider';
import { ContractEvent } from '~types';
import {
  getDomainDatabaseId,
  getMultiSigClient,
  output,
  createColonyAction,
} from '~utils';
import { getBlockChainTimestampISODate } from '~utils/dates';
import { getMultiSigDatabaseId } from '../helpers';

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

interface GetMultiSigDataArgs {
  transactionHash: string;
  multiSigId: BigNumber;
  domainId: number;
  requiredPermissions: number;
  multiSigClient: AnyMultisigPermissionsClient;
  colonyAddress: string;
  isDecision?: boolean;
  timestamp: number;
}

export const getMultiSigData = async ({
  transactionHash,
  multiSigId,
  domainId,
  requiredPermissions,
  multiSigClient,
  colonyAddress,
  isDecision = false,
  timestamp,
}: GetMultiSigDataArgs): Promise<ColonyMultiSig> => {
  const chainId = getChainId();
  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigClient.address,
    multiSigId,
  );

  return {
    id: multiSigDatabaseId,
    colonyAddress,
    nativeMultiSigId: multiSigId.toString(),
    multiSigDomainId: getDomainDatabaseId(colonyAddress, domainId),
    nativeMultiSigDomainId: domainId.toString(),
    requiredPermissions,
    transactionHash,
    isExecuted: false,
    isRejected: false,
    isDecision,
    hasActionCompleted: false,
    createdAt: getBlockChainTimestampISODate(timestamp),
  };
};

const getDomainIdByNativeSkillId = async (
  colonyAddress: string,
  nativeSkillId: string,
): Promise<number | null> => {
  const result = await query<
    GetDomainByNativeSkillIdQuery,
    GetDomainByNativeSkillIdQueryVariables
  >(GetDomainByNativeSkillIdDocument, {
    nativeSkillId,
    colonyAddress,
  });

  if (result?.data?.getDomainByNativeSkillId?.items[0]) {
    return result?.data?.getDomainByNativeSkillId?.items[0].nativeId;
  }

  return null;
};

type MultiSigFields = Omit<
  CreateColonyActionInput,
  | 'id'
  | 'colonyId'
  | 'showInActionsList'
  | 'isMotion'
  | 'motionId'
  | 'initiatorAddress'
  | 'blockNumber'
  | 'rootHash'
> &
  Pick<CreateColonyMultiSigInput, 'expenditureFunding'>;

export const createMultiSigInDB = async (
  colonyAddress: string,
  {
    transactionHash,
    blockNumber,
    args: { motionId: multiSigId },
    timestamp,
  }: ContractEvent,
  { fromDomainId, expenditureFunding, ...input }: MultiSigFields,
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
    colonyAddress,
    motion.domainSkillId.toString(),
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
    timestamp,
  });

  const rootHash = await networkClient.getReputationRootHash({
    blockTag: blockNumber,
  });

  const actionData = {
    id: transactionHash,
    colonyId: colonyAddress,
    isMultiSig: true,
    multiSigId: multiSigData.id,
    showInActionsList: true,
    initiatorAddress: motion.creator,
    blockNumber,
    rootHash,
    fromDomainId: fromDomainId ?? getDomainDatabaseId(colonyAddress, domainId),
    ...input,
  };

  await Promise.all([
    createColonyMultiSig({ ...multiSigData, expenditureFunding }),
    createColonyAction(actionData, timestamp),
  ]);
};
