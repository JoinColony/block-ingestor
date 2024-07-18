import { getStreamingPaymentsClient } from '~utils';
import { EventHandler } from '~types';
import { ExtensionEventListener } from '~eventListeners';

import { createEditStreamingPaymentAction } from './helpers/createEditStreamingPaymentAction';

export const handlePaymentTokenUpdated: EventHandler = async (
  event,
  listener,
) => {
  const { colonyAddress } = listener as ExtensionEventListener;

  const streamingPaymentsClient = await getStreamingPaymentsClient(
    colonyAddress,
  );
  if (!streamingPaymentsClient) {
    return;
  }

  await createEditStreamingPaymentAction({
    event,
    streamingPaymentsClient,
    colonyAddress,
  });
};
