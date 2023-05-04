import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { ColonyMotion, ContractEvent, MotionEvents } from '~types';
import { getVotingClient, verbose } from '~utils';

import { mutate } from '~amplifyClient';

import {
  getMotionDatabaseId,
  getRequiredStake,
  getUserMinStake,
  getMessageKey,
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
  pendingDomainMetadataId: string | null;
}

const getMotionData = async ({
  colonyAddress,
  transactionHash,
  logIndex,
  motionId,
  domainId,
  creatorAddress,
  pendingDomainMetadataId,
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

  return {
    createdBy: votingClient.address,
    id: getMotionDatabaseId(chainId, votingClient.address, motionId),
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
    messages: [
      {
        name: MotionEvents.MotionCreated,
        messageKey: getMessageKey(transactionHash, logIndex),
        initiatorAddress: creatorAddress,
      },
    ],
    pendingDomainMetadataId,
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
  {
    pendingDomainMetadataId,
    ...inputRest
  }: Record<string, any>,
): Promise<void> => {
  const motionData = await getMotionData({
    colonyAddress,
    transactionHash,
    logIndex,
    motionId,
    domainId,
    creatorAddress,
    pendingDomainMetadataId,
  });

  await mutate('createColonyMotion', {
    input: {
      ...motionData,
    },
  });

  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      isMotion: true,
      showInActionsList: false,
      motionDataId: motionData.id,
      initiatorAddress: creatorAddress,
      blockNumber,
      ...inputRest,
    },
  });
};
