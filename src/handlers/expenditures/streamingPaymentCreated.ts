import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  CreateStreamingPaymentDocument,
  CreateStreamingPaymentMutation,
  CreateStreamingPaymentMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import {
  getExpenditureDatabaseId,
  getStreamingPaymentsClient,
  toNumber,
  verbose,
} from '~utils';

export const handleStreamingPaymentCreated: EventHandler = async (
  event,
  listener,
) => {
  const { blockNumber } = event;
  const { streamingPaymentId } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);
  const { colonyAddress } = listener as ExtensionEventListener;

  const streamingPaymentsClient = await getStreamingPaymentsClient(
    colonyAddress,
  );
  if (!streamingPaymentsClient) {
    return;
  }

  const streamingPayment = await streamingPaymentsClient.getStreamingPayment(
    streamingPaymentId,
    { blockTag: blockNumber },
  );
  if (!streamingPayment) {
    return;
  }

  const {
    recipient: recipientAddress,
    domainId,
    startTime,
    endTime,
    interval,
  } = streamingPayment;

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);

  verbose(`Streaming payment with ID ${databaseId} created`);

  await mutate<
    CreateStreamingPaymentMutation,
    CreateStreamingPaymentMutationVariables
  >(CreateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      nativeId: convertedNativeId,
      recipientAddress,
      nativeDomainId: toNumber(domainId),
      startTime: toNumber(startTime),
      endTime: toNumber(endTime),
      interval: interval.toString(),
    },
  });
};
