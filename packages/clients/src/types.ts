export type ChainID = string;

export type WormholeOperationsDetailsReturn =
  | {
      sourceChain: {
        chainId: string;
        transaction?: {
          txHash: string;
        };
        status: string;
      };
      targetChain: {
        chainId: string;
        transaction?: {
          txHash: string;
        };
        status: string;
      };
    }
  | undefined;
