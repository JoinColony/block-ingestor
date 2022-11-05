import dotenv from 'dotenv';
import { ensureFile, readJson, writeJson } from 'fs-extra';
import path from 'path';
import { utils } from 'ethers';
import { Log, EventType } from '@ethersproject/providers';
import { ClientType, ContractClient, getTokenClient } from '@colony/colony-js';

import { coloniesSet } from './trackColonies';
import networkClient from './networkClient';
import { addEvent } from './eventQueue';
import { ContractEventsSignatures, SortOrder, contractEvetsToClientMap } from './types';

dotenv.config();

export const output = (...messages: any[]): void =>
  console.log(`[TX Ingestor ${new Date().toJSON()}]`, ...messages);

export const verbose = (...messages: any[]): void => {
  const verboseOutput = process.env.VERBOSE_OUTPUT === 'true';
  if (verboseOutput) {
    output(...messages);
  }
};

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

export const setToJS = (
  set: Set<string>,
): Array<Record<string, string>> => Array.from(set).map(entry => JSON.parse(entry));

export const addProviderListener = async (
  eventSignature: ContractEventsSignatures,
): Promise<void> => {
  const { provider } = networkClient;
  const clientType = contractEvetsToClientMap[eventSignature];

  let filters: EventType[] = [];
  if (clientType === ClientType.NetworkClient) {
    filters = [{
      address: networkClient.address,
      topics: [utils.id(eventSignature)],
    }];
  }
  if (clientType === ClientType.ColonyClient) {
    filters = setToJS(coloniesSet)
      .map(({ colonyAddress }) => ({
        address: colonyAddress,
        topics: [utils.id(eventSignature)],
      }));
  }
  if (clientType === ClientType.TokenClient) {
    filters = [{
      topics: [utils.id(eventSignature)],
    }];
  }

  filters.map(filter => {
    const { address: contractAddress } = filter as { address?: string, topics: string[] } || {};
    verbose('Added listener for event', eventSignature, contractAddress ? `filtering address ${contractAddress}` : '');
    provider.on(filter, async (log: Log) => {
      const { transactionHash, logIndex, address } = log;
      let client: ContractClient = networkClient;

      if (clientType === ClientType.ColonyClient) {
        client = await networkClient.getColonyClient(address);
      }
      if (clientType === ClientType.TokenClient) {
        client = await getTokenClient(address, provider);
      }

      addEvent({
        ...client.interface.parseLog(log),
        transactionHash,
        logIndex,
        contractAddress: address,
      });
    });
    return undefined;
  });
};
