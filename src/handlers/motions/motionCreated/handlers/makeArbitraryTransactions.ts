import { TransactionDescription } from 'ethers/lib/utils';
import { Id } from '@colony/colony-js';
import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId } from '~utils';

import { createMotionInDB } from '../helpers';

export const handleMakeArbitraryTransactionsMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name } = parsedAction;

  const { _targets: contractAddresses, _actions: encodedFunctions } =
    parsedAction.args;

  const currentArbitraryTransactions = await Promise.all(
    contractAddresses.map(async (contractAddress: string, index: number) => {
      const currentEncodedFunction = encodedFunctions[index];

      return {
        contractAddress,
        encodedFunction: currentEncodedFunction,
      };
    }),
  );

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    arbitraryTransactions: currentArbitraryTransactions,
  });
};
