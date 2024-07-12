import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  StreamingPaymentClaim,
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import { getExpenditureDatabaseId, output, toNumber } from '~utils';
import { getStreamingPaymentFromDB } from './helpers';

export const handleStreamingPaymentClaimed: EventHandler = async (
  event,
  listener,
) => {
  const { timestamp } = event;
  const { amount, streamingPaymentId } = event.args;
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

  const newClaim: StreamingPaymentClaim = {
    amount: amount.toString(),
    timestamp: timestamp.toString(),
  };
  const claims: StreamingPaymentClaim[] = streamingPayment.claims
    ? [...streamingPayment.claims, newClaim]
    : [newClaim];

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      claims,
    },
  });
};
