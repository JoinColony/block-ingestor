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
  const { colonyAddress } = event;
  const { agent: initiatorAddress, streamingPaymentId } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(colonyAddress, convertedNativeId);

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      isWaived: true,
      isCancelled: true,
    },
  });

  verbose(`Streaming payment with ID ${databaseId} waived and cancelled`);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CancelAndWaiveStreamingPayment,
    initiatorAddress,
    streamingPaymentId: databaseId,
  });
};
