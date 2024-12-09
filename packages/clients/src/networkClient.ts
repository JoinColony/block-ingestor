import {
  ColonyNetworkClient,
  Network,
  NetworkClientOptions,
  getColonyNetworkClient,
} from '@colony/colony-js';

import { RpcProvider } from './rpcProvider';

export class NetworkClient {
  private readonly rpcProvider: RpcProvider;
  private readonly network: Network;
  private readonly networkAddress?: string;

  constructor(
    rpcProvider: RpcProvider,
    network: Network,
    networkAddress?: string,
  ) {
    this.rpcProvider = rpcProvider;
    this.network = network;
    this.networkAddress = networkAddress;
  }

  public getInstance(
    options: NetworkClientOptions = { disableVersionCheck: true },
  ): ColonyNetworkClient {
    return getColonyNetworkClient(
      this.network,
      this.rpcProvider.getProviderInstance(),
      {
        ...options,
        networkAddress: this.networkAddress,
      },
    );
  }
}
