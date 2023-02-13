import { AnyColonyClient, Extension } from '@colony/colony-js';
import { TransactionDescription } from 'ethers/lib/utils';

import { mutate } from '../amplifyClient';
import { ContractEvent, motionNameMapping } from '../types';
import { getDomainDatabaseId } from './domains';
import { verbose } from './logger';
import { getColonyTokenAddress } from './tokens';

export const getParsedActionFromMotion = async (
  motionId: string,
  colonyClient: AnyColonyClient,
) => {
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

export const writeMintTokensMotionToDB = async (
  {
    transactionHash,
    contractAddress: colonyAddress,
    blockNumber,
    args: { creator, domainId },
  }: ContractEvent,
  parsedAction: TransactionDescription,
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
    },
  });
};
