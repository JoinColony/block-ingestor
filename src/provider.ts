import { providers } from 'ethers';
import dotenv from 'dotenv';

import { ChainID } from './types';

dotenv.config();

let chainId: ChainID;

export const setChainId = (newChainId: number): void => { chainId = newChainId; };
export const getChainId = (): ChainID => chainId;

const provider = new providers.JsonRpcProvider(process.env.CHAIN_RPC_ENDPOINT);

provider.getNetwork().then(
  ({ chainId: currentChainId }) => {
    setChainId(currentChainId);
  },
);

export default provider;
