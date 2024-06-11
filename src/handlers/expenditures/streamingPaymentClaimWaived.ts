import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

export const handleStreamingPaymentClaimWaived: EventHandler = async (
  event,
  listener,
) => {
  console.log('ROMEO IM IN!');

  const { streamingPaymentId } = event.args;
  const convertedNativeId = toNumber(streamingPaymentId);

  const { colonyAddress } = listener as ExtensionEventListener;

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
};
