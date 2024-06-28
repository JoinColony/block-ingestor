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
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { getStreamingPaymentFromDB } from './helpers';
import { getLimitAmount } from './helpers/getLimitAmount';
import { ExtensionEventListener } from '~eventListeners';

export const handleStreamingPaymentStartTimeSet: EventHandler = async (
  event,
  listener,
) => {
  const { colonyAddress } = listener as ExtensionEventListener;

  const { streamingPaymentId, startTime } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);
  const streamingPayment = await getStreamingPaymentFromDB(databaseId);
  if (!streamingPayment) {
    output(
      `Could not find streaming payment with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  verbose(`Start time set for streaming payment with ID ${databaseId}`);

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      startTime: startTime.toString(),
    },
  });

  if (
    streamingPayment.metadata?.endCondition ===
    StreamingPaymentEndCondition.LimitReached
  ) {
    const { endTime, amount, interval, tokenAddress } = streamingPayment;

    const limitAmount = await getLimitAmount({
      startTime: startTime.toString(),
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
