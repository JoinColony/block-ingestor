import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  ColonyActionType,
  CreateStreamingPaymentDocument,
  CreateStreamingPaymentMutation,
  CreateStreamingPaymentMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  getStreamingPaymentsClient,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';
import { getBlockChainTimestampISODate } from '~utils/dates';

export const handleStreamingPaymentCreated: EventHandler = async (
  event,
  listener,
) => {
  const { blockNumber, timestamp } = event;
  const { streamingPaymentId, agent: initiatorAddress } = event.args;
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
    token: tokenAddress,
    amount,
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
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      interval: interval.toString(),
      tokenAddress,
      amount: amount.toString(),
      colonyId: colonyAddress,
      creatorAddress: initiatorAddress,
      createdAt: getBlockChainTimestampISODate(timestamp),
    },
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CreateStreamingPayment,
    initiatorAddress,
    streamingPaymentId: databaseId,
    fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(domainId)),
    recipientAddress,
  });
};
