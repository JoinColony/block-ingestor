import { AnyColonyClient, Extension } from '@colony/colony-js';
import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import { mutate } from '../amplifyClient';
import { ContractEvent, motionNameMapping, MotionData } from '../types';
import { getRequiredStake, getUserMinStake } from '~handlers/motions/helpers';

import { getVotingClient } from './clients';
import { getDomainDatabaseId } from './domains';
import { verbose } from './logger';
import { getColonyTokenAddress } from './tokens';

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
  const { skillRep, rootHash } = await votingClient.getMotion(motionId);
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

  return {
    motionId: motionId.toString(),
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
