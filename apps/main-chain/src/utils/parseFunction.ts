import { utils } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

/**
 * Helper attempting to decode function data by trying to parse it with different contract ABIs
 * until it finds one that does not throw an error
 * @TODO: This should be refactored to use ABIs from @colony/abis
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
