import { ContractEvent } from '~types';
import {
  getExpenditureDatabaseId,
  getUpdatedExpenditureBalances,
  insertAtIndex,
  output,
  toNumber,
  verbose,
} from '~utils';
import {
  ExpenditurePayout,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import { getAmountWithFee, getNetworkInverseFee } from '~utils/networkFee';

import { getExpenditureFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const {
    id: expenditureId,
    slot,
    token: tokenAddress,
    tokenPayout: amountWithoutFee,
  } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlotId = toNumber(slot);
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

  const updatedPayouts: ExpenditurePayout[] = insertAtIndex(
    existingSlot.payouts,
    existingPayoutIndex,
    {
      ...existingPayout,
      isClaimed: true,
    },
  );
  const updatedSlots = insertAtIndex(expenditure.slots, existingSlotIndex, {
    ...existingSlot,
    payouts: updatedPayouts,
  });

  // @TODO: Update the payout amount with the actual amount paid to the user (which may be different from the original amount due to network fee changing)
  const networkInverseFee = (await getNetworkInverseFee()) ?? '0';
  const amountWithFee = getAmountWithFee(
    amountWithoutFee,
    networkInverseFee,
  ).toString();

  const updatedBalances = getUpdatedExpenditureBalances(
    expenditure.balances ?? [],
    tokenAddress,
    amountWithFee,
    true,
  );

  verbose(`Payout claimed in expenditure with ID ${databaseId}`);

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
        balances: updatedBalances,
      },
    },
  );
};
