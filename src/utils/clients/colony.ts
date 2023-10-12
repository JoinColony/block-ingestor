import {
  AnyColonyClient,
  ColonyClientV10,
  ColonyClientV11,
  ColonyClientV12,
  ColonyClientV13,
  ColonyClientV14,
  ColonyClientV4,
  ColonyClientV5,
  ColonyClientV6,
  ColonyClientV7,
  ColonyClientV8,
  ColonyClientV9,
} from '@colony/colony-js';

import networkClient from '~networkClient';

const colonyClientsCache: Record<string, AnyColonyClient> = {};

/**
 * Method attempting to return a cached colony client,
 * or get one from the networkClient if there's no cached entry
 */
export const getCachedColonyClient = async (
  colonyAddress: string,
): Promise<AnyColonyClient | null> => {
  if (colonyAddress in colonyClientsCache) {
    return colonyClientsCache[colonyAddress];
  }

  try {
    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    colonyClientsCache[colonyAddress] = colonyClient;
    return colonyClient;
  } catch (error) {
    console.error(
      `Unable to fetch colony client for address: ${colonyAddress}`,
      error,
    );
  }

  return null;
};

type ExpenditureCompatibleColonyClient =
  | ColonyClientV4
  | ColonyClientV5
  | ColonyClientV6
  | ColonyClientV7
  | ColonyClientV8
  | ColonyClientV9
  | ColonyClientV10
  | ColonyClientV11
  | ColonyClientV12
  | ColonyClientV13
  | ColonyClientV14;

export const checkColonyClientExpenditureCompatibility = (
  colonyClient: AnyColonyClient | null,
): ExpenditureCompatibleColonyClient | null => {
  if ((colonyClient?.clientVersion ?? 1) >= 4) {
    return colonyClient as ExpenditureCompatibleColonyClient;
  }

  return null;
};
