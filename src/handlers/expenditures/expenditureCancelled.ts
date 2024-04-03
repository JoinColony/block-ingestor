import { ContractEvent } from '~types';
import {
  getExpenditureDatabaseId,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  console.log(event);
  const { expenditureId, agent: initiatorAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  /**
   * @NOTE: This event can be emitted by either colony or StakedExpenditure extension
   * Depending on that, the colony address will be accessible under `colonyAddress` or `contractAddress`
   */
  const colonyAddress = event.colonyAddress ?? event.contractAddress;

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    'Expenditure with ID',
    databaseId,
    'cancelled in Colony:',
    colonyAddress,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        status: ExpenditureStatus.Cancelled,
      },
    },
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CancelExpenditure,
    initiatorAddress,
    expenditureId: databaseId,
  });
};
