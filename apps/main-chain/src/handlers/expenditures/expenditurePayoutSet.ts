import { ContractEvent } from '@joincolony/blocks';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';
import {
  ExpenditurePayout,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import amplifyClient from '~amplifyClient';
import { splitAmountAndFee } from '~utils/networkFee';

import {
  getExpenditureFromDB,
  getUpdatedExpenditureSlots,
  createEditExpenditureAction,
  NotEditActionError,
} from './helpers';
import { output, verbose } from '@joincolony/utils';

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

  try {
    await createEditExpenditureAction(event, expenditure, colonyClient);
  } catch (error) {
    if (error instanceof NotEditActionError) {
      // If transaction does not contain edit expenditure action, continue processing as normal
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

      await amplifyClient.mutate<
        UpdateExpenditureMutation,
        UpdateExpenditureMutationVariables
      >(UpdateExpenditureDocument, {
        input: {
          id: databaseId,
          slots: updatedSlots,
          firstEditTransactionHash: expenditure.firstEditTransactionHash
            ? undefined
            : event.transactionHash,
        },
      });
    } else {
      // Make sure to re-throw any other errors
      throw error;
    }
  }
};
