import { providers } from 'ethers';
import dotenv from 'dotenv';

import { ChainID } from './types';

dotenv.config();

let chainId: ChainID;

export const setChainId = (newChainId: ChainID): void => {
  chainId = newChainId;
};
export const getChainId = (): ChainID => chainId;

const provider = new providers.StaticJsonRpcProvider(
  process.env.CHAIN_RPC_ENDPOINT,
);

export const initialiseProvider = async (): Promise<void> => {
  const { chainId } = await provider.getNetwork();
  setChainId(String(chainId));
};

export default provider;
