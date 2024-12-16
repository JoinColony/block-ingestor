import { TransactionDescription } from 'ethers/lib/utils';
import { Id } from '@colony/colony-js';
import { ContractEvent, motionNameMapping } from '~types';
import {
  argsByTypeToString,
  decodeArbitraryFunction,
  getDomainDatabaseId,
} from '~utils';

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
      const decodedFunction = await decodeArbitraryFunction(
        currentEncodedFunction,
      );
      const functionInputs = decodedFunction?.functionFragment.inputs;
      const functionArgs = decodedFunction?.args;

      const mappedArgs = functionInputs?.map((item, index) => {
        return {
          name: item.name,
          type: item.type,
          value: argsByTypeToString(functionArgs?.[index], item.type),
        };
      });
      return {
        contractAddress,
        method: decodedFunction?.name,
        methodSignature: decodedFunction?.signature,
        args: mappedArgs,
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
