import { providers } from 'ethers';
import { ChainID } from './types';
import { output } from '@joincolony/utils';

export class RpcProvider {
  public isInitialised = false;
  private readonly provider: providers.StaticJsonRpcProvider;
  private chainId: ChainID | null;

  constructor(rpcEndpoint?: string) {
    this.provider = new providers.StaticJsonRpcProvider(rpcEndpoint);
    this.chainId = null;
  }

  public async initialiseProvider(): Promise<void> {
    const { chainId } = await this.provider.getNetwork();
    this.setChainId(String(chainId));
    this.isInitialised = true;
  }

  public setChainId(newChainId: ChainID): void {
    this.chainId = newChainId;
  }

  public getChainId(): ChainID {
    if (!this.chainId) {
      output(
        'Chain ID has not been initialized. Call initialiseProvider() first!',
      );
    }
    // @TODO handle null properly
    return this.chainId || 'SOME_DEFAULT_CHAIN_ID';
  }

  public getProviderInstance(): providers.StaticJsonRpcProvider {
    return this.provider;
  }
}
