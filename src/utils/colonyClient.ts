import { AnyColonyClient } from '@colony/colony-js';

import { query } from '~amplifyClient';
import {
  Colony,
  GetColonyDocument,
  GetColonyQuery,
  GetColonyQueryVariables,
} from '~graphql';
import networkClient from '~networkClient';

const colonyClientsCache: Record<string, AnyColonyClient> = {};

/**
 * Method attempting to return a cached colony client,
 * or get one from the networkClient if there's no cached entry
 */
export const getCachedColonyClient = async (
  colonyAddress: string,
): Promise<AnyColonyClient | undefined> => {
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

  return;
};

export const getColonyFromDB = async (
  colonyAddress: string,
): Promise<Colony | undefined> => {
  const { data } =
    (await query<GetColonyQuery, GetColonyQueryVariables>(GetColonyDocument, {
      id: colonyAddress,
    })) ?? {};

  const colony = data?.getColony;

  if (!colony) {
    console.error(
      `Could not find colony: ${colonyAddress} in database. This is a bug and should be investigated.`,
    );
    return;
  }

  return colony;
};
