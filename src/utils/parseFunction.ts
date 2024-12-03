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
  const hexSignature = encodedFunction.slice(0, 8);
  const potentialSignatures = await lookupSignature(hexSignature);

  // Create interfaces based on potential signatures
  const interfaces = potentialSignatures
    .map((signature) => {
      try {
        return new utils.Interface([`function ${signature}`]);
      } catch (e) {
        console.error(e);
        return null;
      }
    })
    .filter(Boolean) as utils.Interface[];

  console.log({ interfaces });

  return parseFunctionData(encodedFunction, interfaces);
};

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
(async () => {
  console.log(
    await decodeArbitraryFunction(
      '0x2a2678bb0000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b77d57f4959eafa0339424b83fcfaf9c154074610000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ef841fe1611ce41bfcf0265097efaf50486f511100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000002a496019756f6779891',
    ),
  );
})();

(async () => {
  console.log(
    await decodeArbitraryFunction(
      '0x2a2678bb0000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b77d57f4959eafa0339424b83fcfaf9c154074610000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ef841fe1611ce41bfcf0265097efaf50486f511100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000002a496019756f6779891',
    ),
  );
})();
