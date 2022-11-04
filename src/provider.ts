import { providers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

export default new providers.JsonRpcProvider(process.env.CHAIN_RPC_ENDPOINT);
