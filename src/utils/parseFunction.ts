import { utils } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { output } from './logger';
import { lookupSignature } from './lookupSignature';

/**
 * Helper attempting to decode function data by trying to parse it with different contract ABIs
 * until it finds one that does not throw an error
 */
export const parseFunctionData = (
  functionData: string,
  interfaces: utils.Interface[],
): TransactionDescription | null => {
  for (const iface of interfaces) {
    try {
      const parsed = iface.parseTransaction({ data: functionData });
      return parsed;
    } catch (e) {
      // Ignore
    }
  }
  return null;
};

/**
 * @NOTE: This is a rather rudimentary way of handling multicall motions
 * which only works for multicalls created by UI sagas.
 * It should be refactored as part of https://github.com/JoinColony/colonyCDapp/issues/2317
 */
export const decodeFunctions = (
  encodedFunctions: string[],
  interfaces: utils.Interface[],
): TransactionDescription[] => {
  const decodedFunctions: TransactionDescription[] = [];
  for (const functionCall of encodedFunctions) {
    const parsedFunction = parseFunctionData(functionCall, interfaces);
    if (!parsedFunction) {
      output(`Failed to parse multicall function: ${functionCall}`);
      continue;
    }

    decodedFunctions.push(parsedFunction);
  }

  return decodedFunctions;
};

/**
 * Given encoded function data, attempts to decode function data
 * by looking up the signature
 */
export const decodeArbitraryFunction = async (
  encodedFunction: string,
): Promise<TransactionDescription | null> => {
  const startIndex = encodedFunction.startsWith('0x') ? 2 : 0;
  const hexSignature = encodedFunction.slice(startIndex, startIndex + 8);
  const potentialSignatures = await lookupSignature(hexSignature);

  // Create interfaces based on potential signatures
  const interfaces = potentialSignatures
    .map((signature) => {
      try {
        return new utils.Interface([`function ${signature}`]);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean) as utils.Interface[];

  return parseFunctionData(encodedFunction, interfaces);
};
