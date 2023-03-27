import { AnyColonyClient, ClientType, Extension } from '@colony/colony-js';
import { TransactionDescription } from 'ethers/lib/utils';
import ctx, { ListenerRemover } from '~context';

import { mutate } from '../amplifyClient';
import {
  ContractEvent,
  ContractEventsSignatures,
  motionNameMapping,
} from '../types';
import { getDomainDatabaseId } from './domains';
import { generateListenerRemoverKey } from './events';
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
  await mutate('createColonyAction', {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      type: motionNameMapping[name],
      isMotion: true,
      motionData: {
        motionId: motionId.toString(),
      },
      tokenAddress,
      fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
      initiatorAddress: creator,
      amount,
      blockNumber,
    },
  });
};

const getMotionListenerRemovers = (
  colonyAddress: string,
): ListenerRemover[] => {
  const listenerRemovers: ListenerRemover[] = [];

  const motionSignatures = Object.values(ContractEventsSignatures).filter(
    (sig) => sig.includes('Motion'),
  );

  motionSignatures.forEach((signature) => {
    const key = generateListenerRemoverKey(
      colonyAddress,
      ClientType.VotingReputationClient,
      signature,
    );
    const motionListenerRemover = ctx.listenerRemovers[key];
    if (motionListenerRemover) {
      listenerRemovers.push(motionListenerRemover);
    }
  });

  return listenerRemovers;
};

export const removeMotionListeners = (colonyAddress: string): void => {
  const listenerRemovers = getMotionListenerRemovers(colonyAddress);
  listenerRemovers.forEach((listenerRemover) => {
    listenerRemover();
  });
};