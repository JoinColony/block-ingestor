import { BigNumber } from 'ethers';
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
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, timestamp } = event;
  const { agent: initiatorAddress, streamingPaymentId, endTime } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);

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
