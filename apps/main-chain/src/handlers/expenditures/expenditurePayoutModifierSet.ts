import { ContractEvent } from '@joincolony/blocks';
import { getExpenditureDatabaseId, toNumber } from '~utils';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import amplifyClient from '~amplifyClient';

import { getExpenditureFromDB, getUpdatedExpenditureSlots } from './helpers';
import { output, verbose } from '@joincolony/utils';

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

  const updatedSlots = getUpdatedExpenditureSlots(
    expenditure.slots,
    convertedSlot,
    {
      payoutModifier: convertedPayoutModifier,
    },
  );

  verbose(
    `Payout modifier set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      slots: updatedSlots,
    },
  });
};
