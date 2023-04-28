import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { MotionData, ContractEvent, MotionEvents } from '~types';
import { getVotingClient, verbose } from '~utils';

import { mutate } from '~amplifyClient';

import {
  getMotionDatabaseId,
  getRequiredStake,
  getUserMinStake,
} from '../helpers';
import { AnyColonyClient, AnyOneTxPaymentClient } from '@colony/colony-js/*';

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
  transactionHash: string;
  logIndex: number;
  motionId: BigNumber;
  domainId: BigNumber;
  creatorAddress: string;
}

const getMotionData = async ({
  colonyAddress,
  transactionHash,
  logIndex,
  motionId,
  domainId,
  creatorAddress,
}: Props): Promise<MotionData> => {
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

  return {
    createdBy: votingClient.address,
    motionId: getMotionDatabaseId(chainId, votingClient.address, motionId),
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
    motionDomainId: domainId.toString(),
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
    hasPassed: false,
    inRevealPhase: false,
    hasFailedNotFinalizable: false,
    messages: [
      {
        name: MotionEvents.MotionCreated,
        messageKey: `${transactionHash}${logIndex}`,
        initiatorAddress: creatorAddress,
      },
    ],
  };
};

export const createMotionInDB = async (
  {
    transactionHash,
    blockNumber,
    logIndex,
    contractAddress: colonyAddress,
    args: { motionId, creator: creatorAddress, domainId },
  }: ContractEvent,
  input: Record<string, any>,
): Promise<void> => {
  const motionData = await getMotionData({
    colonyAddress,
    transactionHash,
    logIndex,
    motionId,
    domainId,
    creatorAddress,
  });

  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      isMotion: true,
      showInActionsList: false,
      motionData,
      initiatorAddress: creatorAddress,
      blockNumber,
      ...input,
    },
  });
};
