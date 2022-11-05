import dotenv from 'dotenv';
import { ensureFile, readJson, writeJson } from 'fs-extra';
import path from 'path';
import { utils } from 'ethers';
import { Log } from '@ethersproject/providers';
import { AnyColonyClient, ClientType, ColonyNetworkClient, getTokenClient, TokenClient } from '@colony/colony-js';

import networkClient from './networkClient';
import { addEvent } from './eventQueue';
import { ContractEventsSignatures, SortOrder } from './types';

dotenv.config();

/*
 * Log to console with name and timestamp
 * Used for basic stuff, which will always be logged
 */
export const output = (...messages: any[]): void =>
  console.log(`[TX Ingestor ${new Date().toJSON()}]`, ...messages);

/*
 * Log to console with name and timestamp
 * This should be added to internals, which you don't always want to show in production
 * This is controlled by the `VERBOSE_OUTPUT` env variable
 */
export const verbose = (...messages: any[]): void => {
  const verboseOutput = process.env.VERBOSE_OUTPUT === 'true';
  if (verboseOutput) {
    output(...messages);
  }
};

/*
 * Read a json file at a specified path.
 * If the file (including the path) doesn't exist, it will be created and seeded
 * with an empty object
 */
export const readJsonStats = async (
  filePath = `${path.resolve(__dirname, '..')}/run/stats.json`,
): Promise<Record<string, unknown>> => {
  await ensureFile(filePath);
  let jsonContents;
  try {
    jsonContents = await readJson(filePath);
    return jsonContents;
  } catch (error) {
    await writeJson(filePath, {});
    return {};
  }
};

/*
 * Write a json file at a specified path.
 * It accepts either a object fragment (or full object) that will get appended to the existing file,
 * or a callback (which receives the current version of the file) and needs to return the new object
 * that will be written back
 */
export const writeJsonStats = async (
  objectOrFunction: Record<string, unknown> | ((jsonFile: Record<string, unknown>) => Record<string, unknown>),
  filePath = `${path.resolve(__dirname, '..')}/run/stats.json`,
): Promise<void> => {
  let newJsonContents = {};
  const curentJsonContents = await readJsonStats(filePath);

  if (typeof objectOrFunction === 'function') {
    newJsonContents = objectOrFunction(curentJsonContents);
  }

  newJsonContents = {
    ...curentJsonContents,
    ...objectOrFunction,
  };

  await writeJson(filePath, newJsonContents);
  verbose('Stats file updated');
};

/*
 * Sort an array by a list (object) of priorities
 * List (object) key is customizable, and priorties are positive integers
 * Negative integers relegate the items at the back of the array
 *
 * See: `contractEventsPriorityMap` from `./types` for an example
 */
export const sortByPriority = (
  key: string,
  priorities: Record<string, number>,
  order = SortOrder.Asc,
): ((firstEntry: any, secondEntry: any) => number) => (firstEntry, secondEntry) => {
  if (
    !Object.prototype.hasOwnProperty.call(firstEntry, key) ||
    !Object.prototype.hasOwnProperty.call(secondEntry, key)
  ) {
    return 0;
  }

  const [maxPriority] = Object.values(priorities).sort().reverse();

  const first = (firstEntry[key] in priorities)
    ? priorities[firstEntry[key] as keyof typeof priorities]
    : maxPriority + 1;
  const second = (secondEntry[key] in priorities)
    ? priorities[secondEntry[key] as keyof typeof priorities]
    : maxPriority + 1;

  /*
   * Negative sort priority moves it to the back of the list
   */
  if (first < 0 || second < 0) {
    return -1;
  }

  let result = 0;
  if (first < second) {
    result = -1;
  } else if (first > second) {
    result = 1;
  }
  return (order === SortOrder.Desc) ? ~result : result;
};

/*
 * Convert a Set that contains a JSON string, back into JS form
 */
export const setToJS = (
  set: Set<string>,
): Array<Record<string, string>> => Array.from(set).map(entry => JSON.parse(entry));

/*
 * Generator method for events listeners
 *
 * It basically does away with all the boilerplate of setting up topics, setting
 * the event listener, parsing the received event
 */
export const eventListenerGenerator = async (
  eventSignature: ContractEventsSignatures,
  contractAddress?: string,
  clientType: ClientType = ClientType.NetworkClient,
): Promise<void> => {
  const { provider } = networkClient;
  let client: ColonyNetworkClient | TokenClient | AnyColonyClient = networkClient;
  if (clientType === ClientType.ColonyClient && contractAddress) {
    client = await networkClient.getColonyClient(contractAddress);
  }

  const filter: { topics: string[], address?: string } = {
    topics: [utils.id(eventSignature)],
  };
  if (contractAddress) {
    filter.address = contractAddress;
  }

  verbose(
    'Added listener for Event:',
    eventSignature,
    contractAddress ? `filtering Address: ${contractAddress}` : '',
  );

  provider.on(filter, async (log: Log) => {
    const { transactionHash, logIndex, blockNumber, address: eventContractAddress } = log;
    if (clientType === ClientType.TokenClient) {
      client = await getTokenClient(eventContractAddress, provider);
    }
    addEvent({
      ...client.interface.parseLog(log),
      blockNumber,
      transactionHash,
      logIndex,
      contractAddress: eventContractAddress,
    });
  });
};

/*
 * Network Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addNetworkEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string = networkClient.address,
): Promise<void> => await eventListenerGenerator(
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
): Promise<void> => await eventListenerGenerator(
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
): Promise<void> => await eventListenerGenerator(
  eventSignature,
  undefined,
  ClientType.TokenClient,
);
