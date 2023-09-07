import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import {
  ExpenditurePayout,
  ExpenditureSlot,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';

import { getExpenditureFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, token: tokenAddress, amount } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${convertedExpenditureId} and colony address: ${colonyAddress} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const existingSlot = expenditure.slots.find(
    (slot) => slot.id === convertedSlot,
  );

  const updatedPayouts: ExpenditurePayout[] = [
    ...(existingSlot?.payouts?.filter(
      (payout) => payout.tokenAddress !== tokenAddress,
    ) ?? []),
    {
      tokenAddress,
      amount: amount.toString(),
      isClaimed: false,
    },
  ];

  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: convertedSlot,
    payouts: updatedPayouts,
  };
  const updatedSlots = [
    ...expenditure.slots.filter((slot) => slot.id !== convertedSlot),
    updatedSlot,
  ];

  verbose(
    `Payout set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
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
