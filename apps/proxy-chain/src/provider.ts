import { RpcProvider } from '@joincolony/clients';

const rpcProvider = new RpcProvider(process.env.CHAIN_RPC_ENDPOINT);
export default rpcProvider;
