import { output } from '@joincolony/utils';
import { utils } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

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
