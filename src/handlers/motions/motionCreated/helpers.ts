import { AnyColonyClient, Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { mutate } from '~amplifyClient';
import { MotionData, ContractEvent, motionNameMapping } from '~types';
import {
  getColonyTokenAddress,
  getDomainDatabaseId,
  getVotingClient,
  verbose,
} from '~utils';

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

const getMotionData = async (
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

export const writeMintTokensMotionToDB = async (
  {
    transactionHash,
    contractAddress: colonyAddress,
    blockNumber,
    args: { motionId, creator, domainId },
  }: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const amount = actionArgs[0].toString();
  const tokenAddress = await getColonyTokenAddress(colonyAddress);
  const motionData = await getMotionData(colonyAddress, motionId, domainId);
  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      type: motionNameMapping[name],
      isMotion: true,
      motionData,
      tokenAddress,
      fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
      initiatorAddress: creator,
      amount,
      blockNumber,
    },
  });
};
