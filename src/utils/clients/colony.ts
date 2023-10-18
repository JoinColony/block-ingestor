import { AnyColonyClient } from '@colony/colony-js';

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
