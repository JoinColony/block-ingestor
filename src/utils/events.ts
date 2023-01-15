import { Contract, utils } from 'ethers';
import { Log } from '@ethersproject/providers';
import {
  AnyColonyClient,
  ClientType,
  ColonyNetworkClient,
  getTokenClient,
  TokenClient,
} from '@colony/colony-js';

import { verbose } from './logger';
import networkClient from '../networkClient';
import { ContractEvent, ContractEventsSignatures } from '../types';
import { addEvent } from '../eventQueue';

/*
 * Convert a Set that contains a JSON string, back into JS form
 */
export const setToJS = (set: Set<string>): Array<Record<string, string>> =>
  Array.from(set).map((entry) => JSON.parse(entry));

/*
 * Generator method for events listeners
 *
 * It basically does away with all the boilerplate of setting up topics, setting
 * the event listener, parsing the received event
 */
export const eventListenerGenerator = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
  clientType: ClientType = ClientType.NetworkClient,
): Promise<void> => {
  const { provider } = networkClient;
  let client: ColonyNetworkClient | TokenClient | AnyColonyClient =
    networkClient;
  if (clientType === ClientType.ColonyClient && contractAddress) {
    client = await networkClient.getColonyClient(contractAddress);
  }

  const filter: { topics: Array<string | null>; address?: string } = {
    topics: [utils.id(eventSignature)],
  };

  if (clientType === ClientType.TokenClient) {
    filter.topics = [
      ...filter.topics,
      null,
      utils.hexZeroPad(contractAddress, 32),
    ];
  } else {
    filter.address = contractAddress;
  }

  verbose(
    'Added listener for Event:',
    eventSignature,
    contractAddress ? `filtering Address: ${contractAddress}` : '',
  );

  provider.on(filter, async (log: Log) => {
    const {
      transactionHash,
      logIndex,
      blockNumber,
      address: eventContractAddress,
    } = log;
    if (clientType === ClientType.TokenClient) {
      client = await getTokenClient(eventContractAddress, provider);
    }
    try {
      const { hash: blockHash, timestamp } = await provider.getBlock(
        blockNumber,
      );
      addEvent({
        ...client.interface.parseLog(log),
        blockNumber,
        transactionHash,
        logIndex,
        contractAddress: eventContractAddress,
        blockHash,
        timestamp,
      });
    } catch (error) {
      verbose('Failed to process the event: ', error);
    }
  });
};

/*
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

/*
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

/*
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
  const extensionContract = new Contract(extensionAddress, [
    `event ${eventSignature}`,
  ]);
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

export const mapLogToContractEvent = async (
  log: Log,
  iface: utils.Interface,
): Promise<ContractEvent | null> => {
  const { provider } = networkClient;
  const {
    transactionHash,
    logIndex,
    blockNumber,
    address: eventContractAddress,
  } = log;
  const { hash: blockHash, timestamp } = await provider.getBlock(blockNumber);

  return {
    ...iface.parseLog(log),
    blockNumber,
    transactionHash,
    logIndex,
    contractAddress: eventContractAddress,
    blockHash,
    timestamp,
  };
};
