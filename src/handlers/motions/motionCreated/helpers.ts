import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import {
  AnyColonyClient,
  AnyOneTxPaymentClient,
  AnyVotingReputationClient,
} from '@colony/colony-js';

import { ContractEvent, MotionEvents } from '~types';
import { getVotingClient, verbose } from '~utils';
import { mutate } from '~amplifyClient';
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
  motionId: string,
  colonyAddress: string,
  clients: [AnyColonyClient, AnyOneTxPaymentClient],
): Promise<TransactionDescription | undefined> => {
  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const motion = await votingClient.getMotion(motionId);

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

interface Props {
  motionId: BigNumber;
  domainId: BigNumber;
  votingClient: AnyVotingReputationClient;
}

const getMotionData = async ({
  motionId,
  domainId,
  votingClient,
}: Props): Promise<ColonyMotion> => {
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

const createActionWithMotion = async (
  actionData: CreateColonyActionInput,
  motionData: CreateColonyMotionInput,
  initialMotionMessage: CreateMotionMessageInput,
): Promise<void> => {
  await mutate<CreateColonyMotionMutation, CreateColonyMotionMutationVariables>(
    CreateColonyMotionDocument,
    {
      input: {
        ...motionData,
      },
    },
  );

  await mutate<
    CreateMotionMessageMutation,
    CreateMotionMessageMutationVariables
  >(CreateMotionMessageDocument, {
    input: {
      ...initialMotionMessage,
    },
  });

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
  input: Omit<
    CreateColonyActionInput,
    | 'id'
    | 'colonyId'
    | 'showInActionsList'
    | 'isMotion'
    | 'motionId'
    | 'initiatorAddress'
    | 'blockNumber'
  >,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const motionData = await getMotionData({
    votingClient,
    motionId,
    domainId,
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

  createActionWithMotion(actionData, motionData, initialMotionMessage);
};
