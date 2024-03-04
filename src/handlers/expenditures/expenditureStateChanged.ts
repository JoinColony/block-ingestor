import { ContractEvent } from '~types';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
} from '~utils';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';

import { getExpenditureFromDB, decodeUpdatedSlots } from './helpers';

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

  verbose(`State of expenditure with ID ${databaseId} updated`);

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
      },
    },
  );
};
