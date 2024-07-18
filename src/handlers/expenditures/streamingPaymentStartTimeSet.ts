import { EventHandler } from '~types';
import { getStreamingPaymentsClient } from '~utils';
import { ExtensionEventListener } from '~eventListeners';
import { createEditStreamingPaymentAction } from './helpers/createEditStreamingPaymentAction';

export const handleStreamingPaymentStartTimeSet: EventHandler = async (
  event,
  listener,
) => {
  const { colonyAddress } = listener as ExtensionEventListener;

  if (!colonyAddress) {
    return;
  }

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
