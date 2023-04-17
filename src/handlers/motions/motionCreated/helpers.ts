import { AnyColonyClient, Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, MotionData } from '~types';
import { getVotingClient, verbose } from '~utils';
import { mutate } from '~amplifyClient';

import {
  getMotionDatabaseId,
  getRequiredStake,
  getUserMinStake,
} from '../helpers';

export const getParsedActionFromMotion = async (
  motionId: string,
  colonyClient: AnyColonyClient,
): Promise<TransactionDescription | undefined> => {
  const votingClient = await colonyClient.getExtensionClient(
    Extension.VotingReputation,
  );

  const motion = await votingClient.getMotion(motionId);

  try {
    return colonyClient.interface.parseTransaction({
      data: motion.action,
    });
  } catch {
    verbose(`Unable to parse ${motion.action}`);
    return undefined;
  }
};

export const getMotionData = async (
  colonyAddress: string,
  motionId: BigNumber,
  domainId: BigNumber,
): Promise<MotionData> => {
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
  };
};

export const createMotionInDB = async (
  {
    transactionHash,
    blockNumber,
    contractAddress: colonyAddress,
    args: { motionId, creator, domainId },
  }: ContractEvent,
  input: Record<string, any>,
): Promise<void> => {
  const motionData = await getMotionData(colonyAddress, motionId, domainId);

  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      isMotion: true,
      showInActionsList: false,
      motionData,
      initiatorAddress: creator,
      blockNumber,
      ...input,
    },
  });
};
