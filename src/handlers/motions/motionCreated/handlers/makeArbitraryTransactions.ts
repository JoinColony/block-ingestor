import { TransactionDescription } from 'ethers/lib/utils';
import { Id } from '@colony/colony-js';
import { ContractEvent, motionNameMapping } from '~types';
import { generateArbitraryTxsFromArrays, getDomainDatabaseId } from '~utils';

import { createMotionInDB } from '../helpers';

export const handleMakeArbitraryTransactionsMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name } = parsedAction;

  const { _targets: contractAddresses, _actions: encodedFunctions } =
    parsedAction.args;

  const currentArbitraryTransactions = await generateArbitraryTxsFromArrays({
    addresses: contractAddresses,
    encodedFunctions,
  });

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    arbitraryTransactions: currentArbitraryTransactions,
  });
};
