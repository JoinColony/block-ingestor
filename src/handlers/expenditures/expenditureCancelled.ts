import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  /**
   * @NOTE: This event can be emitted by either colony or StakedExpenditure extension
   * Depending on that, the colony address will be accessible under `colonyAddress` or `contractAddress`
   */
  const colonyAddress = event.colonyAddress ?? event.contractAddress;

  verbose(
    'Expenditure with ID',
    convertedExpenditureId,
    'cancelled in Colony:',
    colonyAddress,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
        status: ExpenditureStatus.Cancelled,
      },
    },
  );
};
