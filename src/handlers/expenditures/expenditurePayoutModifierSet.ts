import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import {
  ExpenditureSlot,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';

import { getExpenditureFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, payoutModifier } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);
  const convertedPayoutModifier = toNumber(payoutModifier);

  const databaseId = getExpenditureDatabaseId(colonyAddress, expenditureId);

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const existingSlot = expenditure.slots.find(
    (slot) => slot.id === convertedSlot,
  );
  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: convertedSlot,
    payoutModifier: convertedPayoutModifier,
  };
  const updatedSlots = [
    ...expenditure.slots.filter((slot) => slot.id !== convertedSlot),
    updatedSlot,
  ];

  verbose(
    `Payout modifier set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

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
