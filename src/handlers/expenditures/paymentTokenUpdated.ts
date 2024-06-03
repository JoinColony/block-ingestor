import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';

import { getStreamingPaymentFromDB } from './helpers';
import { EventHandler } from '~types';
import { ExtensionEventListener } from '~eventListeners';

export const handlePaymentTokenUpdated: EventHandler = async (
  event,
  listener,
) => {
  const { streamingPaymentId, token: tokenAddress, amount } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);
  const { colonyAddress } = listener as ExtensionEventListener;

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);
  const streamingPayment = await getStreamingPaymentFromDB(databaseId);

  if (!streamingPayment) {
    return;
  }

  const newPayout = {
    amount: amount.toString(),
    tokenAddress,
    isClaimed: false,
  };
  const updatedPayouts = [
    ...(streamingPayment.payouts?.filter(
      (payout) => payout.tokenAddress !== tokenAddress,
    ) ?? []),
    newPayout,
  ];

  verbose(`Payment token updated for streaming payment with ID ${databaseId}`);

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      payouts: updatedPayouts,
    },
  });
};
