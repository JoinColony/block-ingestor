import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import {
  AnyColonyClient,
  AnyOneTxPaymentClient,
  AnyVotingReputationClient,
} from '@colony/colony-js';

import { ContractEvent, MotionEvents } from '~types';
import { getDomainDatabaseId, getVotingClient, verbose } from '~utils';
import { GraphQLFnReturn, mutate } from '~amplifyClient';
import {
  ColonyMotion,
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
  CreateColonyMotionDocument,
  CreateColonyMotionInput,
  CreateColonyMotionMutation,
  CreateColonyMotionMutationVariables,
  CreateMotionMessageDocument,
  CreateMotionMessageInput,
  CreateMotionMessageMutation,
  CreateMotionMessageMutationVariables,
} from '~graphql';

import {
  getMotionDatabaseId,
  getRequiredStake,
  getUserMinStake,
  getMessageKey,
} from '../helpers';

export const getParsedActionFromMotion = async (
  motion: { action: string },
  clients: [AnyColonyClient, AnyOneTxPaymentClient],
): Promise<TransactionDescription | undefined> => {
  for (const client of clients) {
    // Return the first time a client can successfully parse the motion
    try {
      return client.interface.parseTransaction({
        data: motion.action,
      });
    } catch {
      continue;
    }
  }

  verbose(`Unable to parse ${motion.action}`);
  return undefined;
};

interface GetMotionDataArgs {
  transactionHash: string;
  motionId: BigNumber;
  domainId: BigNumber;
  votingClient: AnyVotingReputationClient;
  colonyAddress: string;
}

export const getMotionData = async ({
  transactionHash,
  motionId,
  domainId,
  votingClient,
  colonyAddress,
}: GetMotionDataArgs): Promise<ColonyMotion> => {
  const { skillRep, rootHash, repSubmitted } = await votingClient.getMotion(
    motionId,
  );
  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const userMinStakeFraction = await votingClient.getUserMinStakeFraction();
  const requiredStake: string = getRequiredStake(
    skillRep,
    totalStakeFraction,
  ).toString();

  const userMinStake = getUserMinStake(
    totalStakeFraction,
    userMinStakeFraction,
    skillRep,
  );

  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );

  return {
    createdBy: votingClient.address,
    id: motionDatabaseId,
    nativeMotionId: motionId.toString(),
    motionStakes: {
      raw: {
        nay: '0',
        yay: '0',
      },
      percentage: {
        nay: '0',
        yay: '0',
      },
    },
    requiredStake,
    remainingStakes: [requiredStake, requiredStake], // [nayRemaining, yayRemaining]
    usersStakes: [],
    userMinStake,
    rootHash,
    motionDomainId: getDomainDatabaseId(colonyAddress, domainId.toNumber()),
    nativeMotionDomainId: domainId.toString(),
    stakerRewards: [],
    voterRecord: [],
    isFinalized: false,
    revealedVotes: {
      raw: {
        nay: '0',
        yay: '0',
      },
      percentage: {
        nay: '0',
        yay: '0',
      },
    },
    repSubmitted: repSubmitted.toString(),
    skillRep: skillRep.toString(),
    hasObjection: false,
    motionStateHistory: {
      hasVoted: false,
      hasPassed: false,
      hasFailed: false,
      hasFailedNotFinalizable: false,
      inRevealPhase: false,
    },
    transactionHash,
  };
};

const getInitialMotionMessage = async (
  votingClient: AnyVotingReputationClient,
  motionId: BigNumber,
  transactionHash: string,
  logIndex: number,
  creatorAddress: string,
): Promise<CreateMotionMessageInput> => {
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );

  return {
    name: MotionEvents.MotionCreated,
    messageKey: getMessageKey(transactionHash, logIndex),
    initiatorAddress: creatorAddress,
    motionId: motionDatabaseId,
  };
};

const createColonyMotion = async (
  motionData: CreateColonyMotionInput,
): Promise<void> => {
  await mutate<CreateColonyMotionMutation, CreateColonyMotionMutationVariables>(
    CreateColonyMotionDocument,
    {
      input: {
        ...motionData,
      },
    },
  );
};

const createMotionMessage = async (
  initialMotionMessage: CreateMotionMessageInput,
): Promise<void> => {
  await mutate<
    CreateMotionMessageMutation,
    CreateMotionMessageMutationVariables
  >(CreateMotionMessageDocument, {
    input: {
      ...initialMotionMessage,
    },
  });
};
const createColonyAction = async (
  actionData: CreateColonyActionInput,
): Promise<void> => {
  await mutate<CreateColonyActionMutation, CreateColonyActionMutationVariables>(
    CreateColonyActionDocument,
    {
      input: {
        ...actionData,
      },
    },
  );
};

export const createMotionInDB = async (
  {
    transactionHash,
    blockNumber,
    logIndex,
    colonyAddress,
    args: { motionId, creator: creatorAddress, domainId },
  }: ContractEvent,
  {
    gasEstimate,
    expenditureId,
    ...input
  }: Omit<
    CreateColonyActionInput,
    | 'id'
    | 'colonyId'
    | 'showInActionsList'
    | 'isMotion'
    | 'motionId'
    | 'initiatorAddress'
    | 'blockNumber'
  > & { gasEstimate: string; expenditureId?: string },
): Promise<GraphQLFnReturn<CreateColonyMotionMutation> | undefined> => {
  if (!colonyAddress) {
    return;
  }

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const motionData = await getMotionData({
    transactionHash,
    votingClient,
    motionId,
    domainId,
    colonyAddress,
  });

  const initialMotionMessage = await getInitialMotionMessage(
    votingClient,
    motionId,
    transactionHash,
    logIndex,
    creatorAddress,
  );

  const actionData = {
    id: transactionHash,
    colonyId: colonyAddress,
    isMotion: true,
    showInActionsList: false,
    motionId: motionData.id,
    initiatorAddress: creatorAddress,
    blockNumber,
    ...input,
  };

  await Promise.all([
    createColonyMotion({ ...motionData, gasEstimate, expenditureId }),
    createMotionMessage(initialMotionMessage),
    createColonyAction(actionData),
  ]);
};
