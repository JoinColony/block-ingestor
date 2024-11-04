import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getExpenditureDatabaseId,
  getUpdatedExpenditureBalances,
  insertAtIndex,
  output,
  toNumber,
  transactionHasEvent,
  verbose,
} from '~utils';
import {
  ExpenditurePayout,
  NotificationType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import { getAmountWithFee, getNetworkInverseFee } from '~utils/networkFee';

import { getExpenditureFromDB } from './helpers';
import { sendExpenditureUpdateNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const {
    id: expenditureId,
    slot,
    token: tokenAddress,
    tokenPayout: amountWithoutFee,
    agent: initiatorAddress,
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
    expenditure,
    tokenAddress,
    amountWithFee,
    true,
  );

  verbose(`Payout claimed in expenditure with ID ${databaseId}`);

  const isSplitPayment = !!expenditure.metadata?.distributionType;

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
        balances: updatedBalances,
        // Assume the send notification function will succeed to avoid extra mutations
        splitPaymentPayoutClaimedNotificationSent: isSplitPayment || undefined,
      },
    },
  );

  const hasOneTxPaymentEvent = await transactionHasEvent(
    event.transactionHash,
    ContractEventsSignatures.OneTxPaymentMade,
  );

  // Only send notification on the first split payment payout claimed event
  const shouldSendSplitPayoutClaimedNotification =
    isSplitPayment && !expenditure.splitPaymentPayoutClaimedNotificationSent;

  const shouldSendNotification =
    !hasOneTxPaymentEvent &&
    (!isSplitPayment || shouldSendSplitPayoutClaimedNotification);

  if (shouldSendNotification) {
    sendExpenditureUpdateNotifications({
      colonyAddress,
      creator: initiatorAddress,
      notificationType: NotificationType.ExpenditurePayoutClaimed,
      expenditureID: databaseId,
    });
  }
};
