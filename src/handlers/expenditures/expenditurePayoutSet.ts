import { ContractEvent } from '~types';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
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
import { splitAmountAndFee } from '~utils/networkFee';

import {
  getExpenditureFromDB,
  getUpdatedExpenditureSlots,
  createEditExpenditureAction,
  CreateEditExpenditureActionResult,
} from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, token: tokenAddress, amount } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);

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
      `Could not find expenditure with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const result = await createEditExpenditureAction(
    event,
    expenditure,
    colonyClient,
  );

  if (result === CreateEditExpenditureActionResult.NotEditAction) {
    const [amountLessFee, feeAmount] = await splitAmountAndFee(amount);

    const existingPayouts =
      expenditure.slots.find((slot) => slot.id === convertedSlot)?.payouts ??
      [];

    const updatedPayouts: ExpenditurePayout[] = [
      ...existingPayouts.filter(
        (payout) => payout.tokenAddress !== tokenAddress,
      ),
      {
        tokenAddress,
        amount: amountLessFee,
        networkFee: feeAmount,
        isClaimed: false,
      },
    ];

    const updatedSlots = getUpdatedExpenditureSlots(
      expenditure.slots,
      convertedSlot,
      {
        payouts: updatedPayouts,
      },
    );

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
  }
};
