import { ContractEvent } from '~types';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
} from '~utils';
import {
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureInput,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';

import {
  getExpenditureFromDB,
  decodeUpdatedSlots,
  decodeUpdatedStatus,
} from './helpers';
import { getCanFinalizeExpenditure } from './helpers/expenditureStateUpdate';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { storageSlot, expenditureId, value } = event.args;
  // The unfortunate naming of the `keys` property means we have to access it like so
  const keys = event.args[4];
  const convertedExpenditureId = toNumber(expenditureId);

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

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

  const updatedSlots = decodeUpdatedSlots(
    expenditure,
    storageSlot,
    keys,
    value,
  );

  const updatedStatus = decodeUpdatedStatus(storageSlot, keys, value);

  const updateExpenditureInput: UpdateExpenditureInput = {
    id: databaseId,
    slots: updatedSlots,
    status: updatedStatus,
  };

  if (updatedStatus === ExpenditureStatus.Finalized) {
    const canFinalize = await getCanFinalizeExpenditure(
      expenditure.nativeFundingPotId,
      colonyAddress,
    );

    if (!canFinalize) {
      output(`Can not finalize expenditure with ID: ${databaseId}.`);
      return;
    }

    updateExpenditureInput.finalizedAt = event.timestamp;
  }

  verbose(`State of expenditure with ID ${databaseId} updated`);

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: updateExpenditureInput,
    },
  );
};
