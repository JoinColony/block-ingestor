import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';

import {
  decodeExpenditureStateChangedSlots,
  getExpenditureFromDB,
} from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { storageSlot, value, expenditureId } = event.args;
  // The unfortunate naming of the `keys` property means we have to access it like so
  const keys = event.args[4];
  const convertedExpenditureId = toNumber(expenditureId);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const updatedSlots = decodeExpenditureStateChangedSlots(
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
