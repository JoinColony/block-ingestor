import { Network, getColonyNetworkClient } from '@colony/colony-js';

import rpcProvider from '~provider';

export default getColonyNetworkClient(
  (process.env.CHAIN_NETWORK as Network) || Network.Custom,
  rpcProvider.getProviderInstance(),
  {
    networkAddress: process.env.CHAIN_NETWORK_CONTRACT,
    disableVersionCheck: true,
  },
);
