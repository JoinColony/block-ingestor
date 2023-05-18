import { AnyColonyClient } from '@colony/colony-js';

import { query } from '~amplifyClient';
import networkClient from '~networkClient';
import { ColonyQuery } from '~types';

const colonyClientsCache: Record<string, AnyColonyClient> = {};

/**
 * Method attempting to return a cached colony client,
 * or get one from the networkClient if there's no cached entry
 */
export const getCachedColonyClient = async (
  colonyAddress: string,
): Promise<AnyColonyClient> => {
  if (colonyAddress in colonyClientsCache) {
    return colonyClientsCache[colonyAddress];
  }

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  colonyClientsCache[colonyAddress] = colonyClient;
  return colonyClient;
};

export const getColonyFromDB = async (
  colonyAddress: string,
): Promise<ColonyQuery | undefined> => {
  const colony = await query<ColonyQuery>('getColony', {
    id: colonyAddress,
  });

  if (!colony) {
    console.error(
      `Could not find colony: ${colonyAddress} in database. This is a bug and should be investigated.`,
    );
    return;
  }

  return colony;
};
