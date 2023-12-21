import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';

import { getStreamingPaymentFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  const { streamingPaymentId, token: tokenAddress, amount } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

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
