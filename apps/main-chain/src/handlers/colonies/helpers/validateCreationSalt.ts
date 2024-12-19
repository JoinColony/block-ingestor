import { verbose } from '@joincolony/utils';
import { utils } from 'ethers';
import rpcProvider from '~provider';
import networkClient from '~networkClient';
import { getTransactionSignerAddress } from '~utils/transactions';

const ContractCreationEvents = {
  Create3ProxyContractCreation: 'Create3ProxyContractCreation(address,bytes32)',
};

export const getColonyCreationSalt = async (
  blockNumber: number,
  transactionHash: string,
): Promise<string | null> => {
  const create3ProxyLogs = await rpcProvider.getProviderInstance().getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [utils.id(ContractCreationEvents.Create3ProxyContractCreation)],
  });

  if (create3ProxyLogs.length === 0) {
    verbose(`Couldn't fetch colony proxy contract creation events`);
    return null;
  }

  const create3ProxySalt = create3ProxyLogs[0].topics[2];

  if (!create3ProxySalt) {
    verbose(
      `The Create3ProxyContractCreation log doesn't have the salt data: ${JSON.stringify(create3ProxyLogs[0], null, 2)}`,
    );
    return null;
  }

  const transaction = await rpcProvider
    .getProviderInstance()
    .getTransaction(transactionHash);

  const signerAddress = getTransactionSignerAddress(transaction);

  if (!signerAddress) {
    verbose(
      `Couldn't find the signer for transaction with txHash: ${transactionHash}`,
    );
    return null;
  }

  const generatedColonySalt = await networkClient.getColonyCreationSalt({
    blockTag: blockNumber,
    from: signerAddress,
  });

  const guardedSalt = utils.keccak256(
    utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32'],
      [
        utils.hexZeroPad(networkClient.address, 32),
        generatedColonySalt, // Actual salt
      ],
    ),
  );

  if (guardedSalt !== create3ProxySalt) {
    verbose(
      `The network salt doesn't match the salt used when creating the colony!`,
    );
    return null;
  }

  return generatedColonySalt;
};
