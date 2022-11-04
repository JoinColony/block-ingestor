import { providers } from 'ethers';

export default new providers.JsonRpcProvider(process.env.CHAIN_RPC_ENDPOINT);
