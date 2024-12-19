interface GenerateArbitraryTxsFromArraysParams {
  addresses: string[];
  encodedFunctions: string[];
}

export interface ArbitraryTransaction {
  contractAddress: string;
  encodedFunction: string;
}

export const generateArbitraryTxsFromArrays = async ({
  addresses,
  encodedFunctions,
}: GenerateArbitraryTxsFromArraysParams): Promise<ArbitraryTransaction[]> => {
  const currentArbitraryTransactions = await Promise.all(
    addresses.map(async (contractAddress: string, index: number) => {
      const currentEncodedFunction = encodedFunctions[index];

      return {
        contractAddress,
        encodedFunction: currentEncodedFunction,
      };
    }),
  );
  return currentArbitraryTransactions;
};
