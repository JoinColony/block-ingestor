import { utils } from 'ethers';

import rpcProvider from '~provider';

import { ContractEventsSignatures } from '~types';

/**
 * For a given tx hash, checks whether the transaction contains a matching event
 */
export const transactionHasEvent = async (
  transactionHash: string,
  eventSignature: ContractEventsSignatures,
): Promise<boolean> => {
  const receipt = await rpcProvider
    .getProviderInstance()
    .getTransactionReceipt(transactionHash);
  return receipt.logs.some((log) =>
    log.topics.includes(utils.id(eventSignature)),
  );
};
