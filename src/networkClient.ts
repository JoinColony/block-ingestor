import { Network, getColonyNetworkClient } from '@colony/colony-js';
import dotenv from 'dotenv';

import provider from './provider';

dotenv.config();

export default getColonyNetworkClient(
  (process.env.CHAIN_NETWORK as Network) || Network.Custom,
  provider,
  {
    networkAddress: process.env.CHAIN_NETWORK_CONTRACT,
    disableVersionCheck: true,
  },
);
