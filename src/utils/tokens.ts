import { mutate, query } from '~amplifyClient';
import { ColonyQuery, PendingModifiedTokenAddresses } from '~types';

import { getCachedColonyClient } from './colonyClient';
import { notNull } from './arrays';

export const getColonyTokenAddress = async (
  colonyAddress: string,
): Promise<string> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const tokenAddress = await colonyClient.getToken();
  return tokenAddress;
};

export const getExistingTokenAddresses = (colony: ColonyQuery): string[] =>
  colony.tokens?.items
    .map((tokenItem) => tokenItem?.tokenAddress)
    .filter((item): item is string => !!item) ?? [];

export const updateColonyTokens = async (
  colony: ColonyQuery,
  existingTokenAddresses: string[],
  { added, removed }: PendingModifiedTokenAddresses,
): Promise<void> => {
  const currentAddresses = new Set(existingTokenAddresses);
  added.forEach(async (tokenAddress) => {
    if (!currentAddresses.has(tokenAddress)) {
      /**
       * Call the GetTokenFromEverywhere query to ensure the token
       * gets added to the DB if it doesn't already exist
       */
      const response = await query('getTokenFromEverywhere', {
        input: {
          tokenAddress,
        },
      });

      /**
       * Only create colony/token entry in the DB if the token data was returned by the GetTokenFromEverywhereQuery.
       * Otherwise, it will cause any query referencing it to fail
       */
      if (response?.items?.length) {
        await mutate('createColonyTokens', {
          input: {
            colonyID: colony.colonyAddress,
            tokenID: tokenAddress,
          },
        });
      }
    }
  });

  removed.forEach(async (tokenAddress) => {
    // get the ID of the colony/token entry in the DB (this is separate from token or colony address)
    const { id: colonyTokenId } =
      colony.tokens?.items
        .filter(notNull)
        .find(({ tokenAddress: address }) => address === tokenAddress) ?? {};

    // If we can't find it, e.g. because it has already been removed by another motion, do nothing.
    if (colonyTokenId) {
      await mutate('deleteColonyTokens', {
        input: {
          id: colonyTokenId,
        },
      });
    }
  });
};
