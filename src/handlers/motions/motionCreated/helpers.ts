import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { AnyColonyClient, AnyOneTxPaymentClient } from '@colony/colony-js';

import { ColonyMotion, ContractEvent, MotionEvents, ColonyActionInput, ColonyAction, MotionMessage } from '~types';
import { getVotingClient, verbose } from '~utils';

import { mutate } from '~amplifyClient';

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
  colonyAddress: string;
  motionId: BigNumber;
  domainId: BigNumber;
}

const getMotionData = async ({
  colonyAddress,
  motionId,
  domainId,
}: Props): Promise<ColonyMotion> => {
  const votingClient = await getVotingClient(colonyAddress);
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

const getInitialMotionMessage = async (colonyAddress: string, motionId: BigNumber, transactionHash: string, logIndex: number, creatorAddress: string): Promise<MotionMessage> => {
  const votingClient = await getVotingClient(colonyAddress);
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
  actionData: ColonyAction,
  motionData: ColonyMotion,
  initialMotionMessage: MotionMessage,
): Promise<void> => {
  await mutate('createColonyMotion', {
    input: {
      ...motionData,
    },
  });

  await mutate('createMotionMessage', {
    input: {
      ...initialMotionMessage,
    },
  });

  await mutate('createColonyAction', {
    input: {
      ...actionData,
    },
  });
};

export const createMotionInDB = async (
  {
    transactionHash,
    blockNumber,
    logIndex,
    contractAddress: colonyAddress,
    args: { motionId, creator: creatorAddress, domainId },
  }: ContractEvent,
  input: ColonyActionInput,
): Promise<void> => {
  const motionData = await getMotionData({
    colonyAddress,
    motionId,
    domainId,
  });

  const initialMotionMessage = await getInitialMotionMessage(colonyAddress, motionId, transactionHash, logIndex, creatorAddress);

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
