import { Network } from '@colony/colony-js';

import rpcProvider from '~provider';

import { NetworkClient } from '@joincolony/clients';

export default (new NetworkClient(
  rpcProvider,
  (process.env.CHAIN_NETWORK as Network) || Network.Custom,
  process.env.CHAIN_NETWORK_CONTRACT || '',
)).getInstance();
