import { EventHandler } from '~types';
import { ExtensionEventListener } from '~eventListeners';
import { createEditStreamingPaymentAction } from './helpers/createEditStreamingPaymentAction';
import { Extension, getExtensionHash } from '@colony/colony-js';
import { getInterfaceByExtensionHash } from '~interfaces';

export const handleStreamingPaymentStartTimeSet: EventHandler = async (
  event,
  listener,
) => {
  const { colonyAddress } = listener as ExtensionEventListener;

  if (!colonyAddress) {
    return;
  }

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
};
