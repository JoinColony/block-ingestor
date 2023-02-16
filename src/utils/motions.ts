import { AnyColonyClient, Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { mutate } from '~amplifyClient';
import { ContractEvent, MotionData, motionNameMapping } from '~types';
import { getDomainDatabaseId } from './domains';

import { getColonyTokenAddress } from './tokens';

export const extractDataFromMotion = async (
  motionId: BigNumber,
  colonyClient: AnyColonyClient,
) => {
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

  const motionState = await votingClient.getMotionState(motionId);
  const parsedAction = colonyClient.interface.parseTransaction({
    data: action,
  });

  return {
    parsedAction,
    motionData: {
      motionId: motionId.toString(),
      motionStakes: { nay: nay.toString(), yay: yay.toString() },
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
  { parsedAction, motionData }: MotionData,
) => {
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
