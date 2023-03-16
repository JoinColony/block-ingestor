import { AnyColonyClient, Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import Decimal from 'decimal.js';

import { mutate } from '~amplifyClient';
import {
  ContractEvent,
  AugmentedMotionData,
  motionNameMapping,
  MotionStakeFragment,
} from '~types';

import { getColonyTokenAddress } from './tokens';
import { getVotingClient } from './clients';
import { getDomainDatabaseId } from './domains';

export const convertStakeToPercentage = (
  stake: string | Decimal,
  requiredStake: Decimal,
): string => new Decimal(stake).div(requiredStake).mul(100).toDP(2).toString();

export const getMotionStakePercentages = (
  yay: BigNumber,
  nay: BigNumber,
  requiredStake: Decimal,
): MotionStakeFragment => ({
  yay: convertStakeToPercentage(yay.toString(), requiredStake),
  nay: convertStakeToPercentage(nay.toString(), requiredStake),
});

export const getRequiredStake = async (
  colonyAddress: string,
  skillRep: string,
): Promise<Decimal> => {
  const votingReputationClient = await getVotingClient(colonyAddress);
  const totalStakeFraction =
    await votingReputationClient.getTotalStakeFraction();
  const totalStakeFractionPercentage = new Decimal(
    totalStakeFraction.toString(),
  ).div(new Decimal(10).pow(18).toString());
  return new Decimal(skillRep).mul(totalStakeFractionPercentage).round();
};

export const extractDataFromMotion = async (
  motionId: BigNumber,
  colonyClient: AnyColonyClient,
  colonyAddress: string,
): Promise<AugmentedMotionData> => {
  const votingClient = await colonyClient.getExtensionClient(
    Extension.VotingReputation,
  );

  const {
    action,
    stakes: [nay, yay],
    rootHash,
    domainId: motionDomainId,
    skillRep,
  } = await votingClient.getMotion(motionId);

  const requiredStake = await getRequiredStake(
    colonyAddress,
    skillRep.toString(),
  );
  const motionState = await votingClient.getMotionState(motionId);
  const parsedAction = colonyClient.interface.parseTransaction({
    data: action,
  });

  return {
    parsedAction,
    motionData: {
      motionId: motionId.toString(),
      motionStakes: {
        raw: {
          yay: yay.toString(),
          nay: nay.toString(),
        },
        percentage: getMotionStakePercentages(yay, nay, requiredStake),
      },
      usersStakes: [],
      motionState,
      rootHash,
      motionDomainId: getDomainDatabaseId(
        colonyClient.address,
        motionDomainId.toString(),
      ),
      skillRep: skillRep.toString(),
    },
  };
};

export const writeMintTokensMotionToDB = async (
  {
    transactionHash,
    contractAddress: colonyAddress,
    blockNumber,
    args: { creator, domainId },
  }: ContractEvent,
  { parsedAction, motionData }: AugmentedMotionData,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const amount = actionArgs[0].toString();
  const tokenAddress = await getColonyTokenAddress(colonyAddress);
  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      type: motionNameMapping[name],
      isMotion: true,
      tokenAddress,
      fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
      initiatorAddress: creator,
      amount,
      blockNumber,
      motionData,
    },
  });
};
