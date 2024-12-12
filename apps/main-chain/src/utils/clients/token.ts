import { TokenClient, getTokenClient } from '@colony/colony-js';

import networkClient from '~networkClient';

const tokenClientsCache: Record<string, TokenClient> = {};

/**
 * Method attempting to return a cached token client,
 * or a new instace of it if there's no cached entry
 */
export const getCachedTokenClient = async (
  tokenAddress: string,
): Promise<TokenClient | null> => {
  if (tokenAddress in tokenClientsCache) {
    return tokenClientsCache[tokenAddress];
  }

  try {
    const tokenClient = await getTokenClient(
      tokenAddress,
      networkClient.provider,
    );
    tokenClientsCache[tokenAddress] = tokenClient;
    return tokenClient;
  } catch (error) {
    console.error(
      `Unable to fetch token client for address: ${tokenAddress}`,
      error,
    );
  }

  return null;
};
