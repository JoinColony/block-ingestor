import { BigNumber } from 'ethers';
import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  ColonyActionType,
  StreamingPaymentEndCondition,
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMetadataDocument,
  UpdateStreamingPaymentMetadataMutation,
  UpdateStreamingPaymentMetadataMutationVariables,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import {
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';
import { getStreamingPaymentFromDB } from './helpers';
import { getLimitAmount } from './helpers/getLimitAmount';

export const handleStreamingPaymentEndTimeSet: EventHandler = async (
  event,
  listener,
) => {
  const { timestamp } = event;
  const { agent: initiatorAddress, streamingPaymentId, endTime } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  const { colonyAddress } = listener as ExtensionEventListener;

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);
  const streamingPayment = await getStreamingPaymentFromDB(databaseId);
  if (!streamingPayment) {
    output(
      `Could not find streaming payment with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  // When a streaming payment is cancelled, the endTime is set to the current block timestamp
  // Therefore, if the endTime and timestamp are equal, we can assume this is a cancel action
  const isCancelAction = BigNumber.from(timestamp).eq(endTime);

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
      endTime: endTime.toString(),
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

  if (
    streamingPayment.metadata?.endCondition ===
    StreamingPaymentEndCondition.LimitReached
  ) {
    const { startTime, amount, interval, tokenAddress } = streamingPayment;

    const limitAmount = await getLimitAmount({
      startTime,
      endTime: endTime.toString(),
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
