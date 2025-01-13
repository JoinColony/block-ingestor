import { BigNumber } from 'ethers';
import { ChainID, WormholeOperationsDetailsReturn } from './types';
import { NetworkId } from '@colony/colony-js';
import { output } from '@joincolony/utils';

export class WormholeClient {
  private readonly bridgeEndpoint: string;

  public REQ_STATUS = {
    CONFIRMED: 'confirmed',
  };

  constructor(bridgeEndpoint: string) {
    this.bridgeEndpoint = bridgeEndpoint;
  }

  /**
   * Pads a hex string to a specific byte length.
   * @param hexString - The hexadecimal string to pad.
   * @param byteLength - The target byte length (default is 32).
   * @returns The padded hexadecimal string.
   */
  private padHexToByteLength(hexString: string, byteLength = 32): string {
    let cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

    const targetHexLength = byteLength * 2;

    if (cleanHex.length < targetHexLength) {
      cleanHex = cleanHex.padStart(targetHexLength, '0');
    }

    return '0x' + cleanHex;
  }

  /**
   * Resolves the Wormhole chain ID for a given blockchain chain ID.
   *
   * @param chainId - The blockchain chain ID to resolve (can be a number or string).
   * @returns The corresponding Wormhole chain ID, or a default value for unmapped chains.
   */
  public getWormholeChainId(chainId: ChainID): number {
    const chainIdAsNumber = Number.isInteger(chainId)
      ? Number.parseInt(chainId)
      : '';

    switch (chainIdAsNumber) {
      // On testnet
      case NetworkId.Goerli:
        return 2;
      case NetworkId.Mainnet:
        return 5;
      case NetworkId.Gnosis:
      case NetworkId.Xdai:
      case NetworkId.XdaiQa:
        return 25;
      case NetworkId.Custom:
      case NetworkId.ArbitrumSepolia:
        return 10003;
      case NetworkId.ArbitrumOne:
        return 23;
      default: {
        output(
          `Chain with id ${chainId} is not mapped to a Wormhole chain ID. Using custom`,
        );
        return 2;
      }
    }
  }

  /**
   * Converts a BigNumber to a string for compatibility with the API.
   * @param bigNumber - The BigNumber to convert.
   * @returns The string representation of the BigNumber.
   */
  private bigNumberToString(bigNumber: BigNumber): string {
    return bigNumber.toString();
  }

  /**
   * Fetches operation details from the Wormhole bridge.
   * @param args - The operation parameters including emitterChainId, emitterAddress, and sequence.
   * @returns The response from the bridge API.
   */
  public async fetchOperationDetails(args: {
    emitterChainId: number;
    emitterAddress: string;
    sequence: BigNumber;
  }): Promise<WormholeOperationsDetailsReturn> {
    const { emitterChainId, emitterAddress, sequence } = args;

    const paddedEmitterAddress = this.padHexToByteLength(emitterAddress);
    const sequenceString = this.bigNumberToString(sequence);

    const url = `${this.bridgeEndpoint}/v1/operations/${emitterChainId}/${paddedEmitterAddress}/${sequenceString}`;
    const request = await fetch(url);
    return request.json();
  }
}
