import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateStreamingPaymentDocument,
  CreateStreamingPaymentMutation,
  CreateStreamingPaymentMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  getStreamingPaymentsClient,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, blockNumber } = event;
  const { streamingPaymentId, agent: initiatorAddress } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

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

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CreateStreamingPayment,
    initiatorAddress,
    expenditureId: databaseId,
    fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(domainId)),
  });
};
