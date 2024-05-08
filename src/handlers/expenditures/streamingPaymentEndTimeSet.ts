import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import {
  getExpenditureDatabaseId,
  getStreamingPaymentsClient,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, blockNumber, timestamp } = event;
  const { agent: initiatorAddress, streamingPaymentId } = event.args;
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

  const { endTime } = streamingPayment;

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);

  const isCancelAction = streamingPayment.endTime.eq(timestamp);

  if (isCancelAction) {
    verbose(`Streaming payment with ID ${databaseId} cancelled`);
  } else {
    verbose(`End time set for streaming payment with ID ${databaseId}`);
  }

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      endTime: toNumber(endTime),
      isCancelled: isCancelAction ? true : null,
    },
  });

  if (isCancelAction) {
    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.CancelStreamingPayment,
      initiatorAddress,
      streamingPaymentId: databaseId,
    });
  }
};
