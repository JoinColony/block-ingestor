import { Contract } from 'ethers';

import provider from '../provider';
import baseTokenAbi from '../external/baseTokenAbi.json';
import { output } from './logger';
import networkClient from '../networkClient';

export const getTokenSymbol = async (
  tokenAddress: string,
): Promise<string | null> => {
  const contract = new Contract(tokenAddress, baseTokenAbi, provider);

  let tokenSymbol;
  try {
    tokenSymbol = (await contract.functions.symbol())[0];
    return tokenSymbol;
  } catch {
    output('Could not get symbol of token:', tokenAddress);
    return null;
  }
};

export const getColonyNativeTokenSymbol = async (
  colonyAddress: string,
): Promise<string | null> => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const tokenAddress = await colonyClient.getToken();

  return await getTokenSymbol(tokenAddress);
};
