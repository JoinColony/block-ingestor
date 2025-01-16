import { utils, Transaction } from 'ethers';

const MetatransactionInterface = new utils.Interface([
  'function executeMetaTransaction(address userAddress, bytes memory payload, bytes32 sigR, bytes32 sigS, uint8 sigV) external payable returns (bytes memory)',
]);

export const getTransactionSignerAddress = (
  transaction: Transaction,
): string | undefined => {
  let signerAddress = transaction.from;

  try {
    const metaTx = MetatransactionInterface.parseTransaction({
      data: transaction.data,
      value: transaction.value,
    });
    signerAddress = metaTx.args[0];
  } catch (error) {
    // if it's an error, it just means it's not a metatransaction
  }

  return signerAddress;
};
