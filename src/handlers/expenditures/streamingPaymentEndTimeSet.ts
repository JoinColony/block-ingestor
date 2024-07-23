import { BigNumber } from 'ethers';
import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  ColonyActionType,
  UpdateStreamingPaymentDocument,
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
import { createEditStreamingPaymentAction } from './helpers/createEditStreamingPaymentAction';
import { getInterfaceByExtensionHash } from '~interfaces';
import { Extension, getExtensionHash } from '@colony/colony-js';

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

  if (isCancelAction) {
    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.CancelStreamingPayment,
      initiatorAddress,
      streamingPaymentId: databaseId,
    });

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
  } else {
    const streamingPaymentsExtensionHash = getExtensionHash(
      Extension.StreamingPayments,
    );
    const streamingPaymentsInterface = getInterfaceByExtensionHash(
      streamingPaymentsExtensionHash,
    );

    if (!streamingPaymentsInterface) {
      return;
    }
    await createEditStreamingPaymentAction({
      event,
      streamingPaymentsInterface,
      colonyAddress,
    });
  }
};
