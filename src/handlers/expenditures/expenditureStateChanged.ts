import { mutate } from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
} from '~utils';
import {
  getExpenditureFromDB,
  decodeUpdatedSlot,
  getUpdatedExpenditureSlots,
  decodeUpdatedStatus,
  createEditExpenditureAction,
  CreateEditExpenditureActionResult,
} from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db while handling ExpenditureStateChanged event`,
    );
    return;
  }

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  const result = await createEditExpenditureAction(
    event,
    expenditure,
    colonyClient,
  );

  if (result === CreateEditExpenditureActionResult.NotEditAction) {
    const { storageSlot, value } = event.args;
    const keys = event.args[4];

    const updatedSlot = decodeUpdatedSlot(expenditure, {
      storageSlot,
      keys,
      value,
    });
    const updatedSlots = updatedSlot
      ? getUpdatedExpenditureSlots(
          expenditure.slots,
          updatedSlot.id,
          updatedSlot,
        )
      : undefined;

    const updatedStatus = decodeUpdatedStatus(event);

    verbose(`State of expenditure with ID ${databaseId} changed`);

    if (!!updatedSlots || !!updatedStatus) {
      await mutate<
        UpdateExpenditureMutation,
        UpdateExpenditureMutationVariables
      >(UpdateExpenditureDocument, {
        input: {
          id: databaseId,
          slots: updatedSlots,
          status: updatedStatus,
        },
      });
    }
  }
};
