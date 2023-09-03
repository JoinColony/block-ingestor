import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';

import { getExpenditureFromDB } from './helpers';
import {
  ExpenditurePayout,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { id: expenditureId, slot, token: tokenAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlotId = toNumber(slot);
  const databaseId = getExpenditureDatabaseId(colonyAddress, expenditureId);

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${convertedExpenditureId} and colony address: ${colonyAddress} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const existingSlotIndex = expenditure.slots.findIndex(
    (slot) => slot.id === convertedSlotId,
  );
  const existingSlot = expenditure.slots[existingSlotIndex];
  if (!existingSlot || !existingSlot.payouts) {
    return;
  }

  const existingPayoutIndex = existingSlot.payouts.findIndex(
    (payout) => payout.tokenAddress === tokenAddress,
  );
  const existingPayout = existingSlot.payouts[existingPayoutIndex];
  if (!existingPayout) {
    return;
  }

  const updatedPayouts: ExpenditurePayout[] = [
    ...existingSlot.payouts.slice(0, existingPayoutIndex),
    {
      ...existingPayout,
      isClaimed: true,
    },
    ...existingSlot.payouts.slice(existingPayoutIndex + 1),
  ];
  const updatedSlots = [
    ...expenditure.slots.slice(0, existingSlotIndex),
    {
      ...existingSlot,
      payouts: updatedPayouts,
    },
    ...expenditure.slots.slice(existingSlotIndex + 1),
  ];

  verbose(
    `Payout claimed in expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
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
