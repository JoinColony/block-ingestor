import { Result, TransactionDescription } from 'ethers/lib/utils';
import { BigNumber, utils } from 'ethers';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  output,
  toNumber,
} from '~utils';
import { ContractEvent } from '~types';
import { getExpenditureFromDB } from '~handlers/expenditures/helpers';
import { AnyColonyClient } from '@colony/colony-js';
import { multicallHandlers, supportedMulticallFragments } from './fragments';

export type DecodedFunctions = Array<{
  fragment: string;
  decodedAction: Result;
}>;

const decodeFunctions = (
  encodedActions: utils.Result,
  colonyClient: AnyColonyClient,
): DecodedFunctions => {
  const decodedFunctions: DecodedFunctions = [];
  for (const action of encodedActions) {
    supportedMulticallFragments.forEach((fragment) => {
      try {
        const decodedAction = colonyClient.interface.decodeFunctionData(
          fragment,
          action,
        );
        decodedFunctions.push({
          fragment,
          decodedAction,
        });
      } catch {
        // silent. We are expecting all but one of the fragments to error for each arg.
      }
    });
  }

  return decodedFunctions;
};

export const handleMulticallMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress = '' } = event ?? {};
  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  // Multicall takes an array of an array of encoded actions.
  const encodedActions = parsedAction.args[0];

  // Multicall can have an arbitrary number of underlying actions. Difficult to predict in advance how much
  // gas executing this action will consume. Let's start by assuming 100k gas per action.
  const updatedGasEstimate = gasEstimate
    .add(BigNumber.from(encodedActions.length ?? 0).mul(100000))
    .toString();

  // We need to determine which multicallMotion this is and pass it to the appropriate handler
  const decodedFunctions: DecodedFunctions = decodeFunctions(
    encodedActions,
    colonyClient,
  );

  const [, , expenditureId] = decodedFunctions[0].decodedAction;

  const convertedExpenditureId = toNumber(expenditureId);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db when handling ExpenditureStateChanged event`,
    );
    return;
  }

  for (const [validator, handler] of multicallHandlers) {
    if (
      validator({ decodedFunctions, expenditureStatus: expenditure.status })
    ) {
      handler({
        event,
        decodedFunctions,
        gasEstimate: updatedGasEstimate,
        expenditure,
      });
    }
  }
};
