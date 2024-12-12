import { Network, getColonyNetworkClient } from '@colony/colony-js';

import provider from './provider';

export default getColonyNetworkClient(
  (process.env.CHAIN_NETWORK as Network) || Network.Custom,
  provider,
  {
    networkAddress: process.env.CHAIN_NETWORK_CONTRACT,
    disableVersionCheck: true,
  },
);
