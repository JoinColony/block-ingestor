import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { generateArbitraryTxsFromArrays } from '~utils';
import { createMultiSigInDB } from '../helpers';

export const handleMakeArbitraryTxsMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;
  const { _targets: contractAddresses, _actions: encodedFunctions } =
    parsedAction.args;

  const currentArbitraryTransactions = await generateArbitraryTxsFromArrays({
    addresses: contractAddresses,
    encodedFunctions,
  });

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    arbitraryTransactions: currentArbitraryTransactions,
  });
};
