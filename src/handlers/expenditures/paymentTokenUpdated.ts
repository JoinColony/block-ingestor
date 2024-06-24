import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { mutate } from '~amplifyClient';
import {
  StreamingPaymentEndCondition,
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMetadataDocument,
  UpdateStreamingPaymentMetadataMutation,
  UpdateStreamingPaymentMetadataMutationVariables,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import { ExtensionEventListener } from '~eventListeners';

import { getStreamingPaymentFromDB } from './helpers';
import { getLimitAmount } from './helpers/getLimitAmount';

export const handlePaymentTokenUpdated: EventHandler = async (
  event,
  listener,
) => {
  const { streamingPaymentId, token: tokenAddress, amount, interval } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);
  const { colonyAddress } = listener as ExtensionEventListener;

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);
  const streamingPayment = await getStreamingPaymentFromDB(databaseId);

  if (!streamingPayment) {
    output(`Streaming payment with ID ${databaseId} not found in the database`);
    return;
  }

  verbose(`Payment token updated for streaming payment with ID ${databaseId}`);

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      amount: amount.toString(),
      interval: interval.toString(),
    },
  });

  if (
    streamingPayment.metadata?.endCondition ===
    StreamingPaymentEndCondition.LimitReached
  ) {
    const { startTime, endTime, tokenAddress } = streamingPayment;

    const limitAmount = await getLimitAmount({
      startTime,
      endTime,
      amount,
      interval,
      tokenAddress,
    });

    if (!limitAmount) {
      return;
    }

    verbose(
      `Limit amount updated to ${limitAmount.toString()} for streaming payment with ID ${databaseId}`,
    );

    await mutate<
      UpdateStreamingPaymentMetadataMutation,
      UpdateStreamingPaymentMetadataMutationVariables
    >(UpdateStreamingPaymentMetadataDocument, {
      input: {
        id: databaseId,
        limitAmount: limitAmount.toString(),
      },
    });
  }
};
