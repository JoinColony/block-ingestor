import { getExpenditureDatabaseId, toNumber } from '~utils';
import amplifyClient from '~amplifyClient';
import {
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '@joincolony/graphql';

import { getStreamingPaymentFromDB } from './helpers';
import { verbose } from '@joincolony/utils';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';

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

  await amplifyClient.mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      payouts: updatedPayouts,
    },
  });
};
