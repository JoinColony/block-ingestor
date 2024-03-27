import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import {
  getExpenditureDatabaseId,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, agent: initiatorAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    'Expenditure with ID',
    databaseId,
    'finalized in Colony:',
    colonyAddress,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        status: ExpenditureStatus.Finalized,
        finalizedAt: event.timestamp,
      },
    },
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.FinalizeExpenditure,
    initiatorAddress,
    expenditureId: databaseId,
  });
};
