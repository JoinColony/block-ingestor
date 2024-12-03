import { mutate } from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { EventHandler } from '~types';
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
  NotEditActionError,
} from './helpers';

export const handleExpenditureStateChanged: EventHandler = async (event) => {
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

  try {
    await createEditExpenditureAction(event, expenditure, colonyClient);
  } catch (error) {
    if (error instanceof NotEditActionError) {
      // If transaction does not contain edit expenditure action, continue processing as normal
      const { storageSlot, value } = event.args;
      const keys = event.args[4];

      const updatedSlot = decodeUpdatedSlot(expenditure.slots, {
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
    } else {
      // Make sure to re-throw any other errors
      throw error;
    }
  }
};
