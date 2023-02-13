import { getCachedColonyClient } from './colonyClient';
import { AnyColonyClient, getTokenClient } from '@colony/colony-js';

export const getColonyTokenAddress = async (
  colonyAddress: string,
): Promise<string> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const tokenAddress = await colonyClient.getToken();
  return tokenAddress;
};

export const getColonyTokenData = async (
  tokenAddress: string,
  colonyClient: AnyColonyClient,
): Promise<{ name: string; decimals: number; symbol: string }> => {
  const tokenClient = await getTokenClient(tokenAddress, colonyClient.provider);
  return await tokenClient.getTokenInfo();
};
