import { ClientType } from '@colony/colony-js';
import { Log } from '@ethersproject/abstract-provider';
import { utils } from 'ethers';

import { mapLogToContractEvent, getExtensionContract, verbose } from '~utils';
import { addEvent } from '~eventQueue';
import networkClient from '~networkClient';
import { ContractEventsSignatures } from '~types';

import { eventListenerGenerator } from './eventListenerGenerator';
/**
 * Network Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addNetworkEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string = networkClient.address,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.NetworkClient,
  );

/**
 * Colony Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addColonyEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.ColonyClient,
  );

/**
 * Token Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addTokenEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.TokenClient,
  );

export const addMotionEventListener = async (
  eventSignature: ContractEventsSignatures,
  colonyAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    colonyAddress,
    ClientType.VotingReputationClient,
  );

/**
 * Extension specific event listener
 * It creates a new interface with ABI data describing
 * possible event signature
 */
export const addExtensionEventListener = async (
  eventSignature: ContractEventsSignatures,
  extensionAddress: string,
): Promise<void> => {
  const { provider } = networkClient;
  const extensionContract = getExtensionContract(extensionAddress);
  const filter = {
    topics: [utils.id(eventSignature)],
    address: extensionAddress,
  };

  verbose(
    'Added listener for Event:',
    eventSignature,
    extensionAddress ? `filtering Address: ${extensionAddress}` : '',
  );

  provider.on(filter, async (log: Log) => {
    const event = await mapLogToContractEvent(log, extensionContract.interface);

    if (event) {
      addEvent(event);
    }
  });
};
