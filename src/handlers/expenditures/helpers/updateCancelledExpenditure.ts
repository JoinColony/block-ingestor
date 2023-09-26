import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';

export const updateCancelledExpenditure = async (
  colonyAddress: string,
  event: ContractEvent,
  isStakeForfeited?: boolean,
): Promise<void> => {
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

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
        isStakeForfeited,
      },
    },
  );
};
