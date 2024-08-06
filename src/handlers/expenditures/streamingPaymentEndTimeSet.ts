import { ExtensionEventListener } from '~eventListeners';
import { EventHandler } from '~types';
import { handleEditOrCancelStreamingPaymentAction } from './helpers/handleEditOrCancelStreamingPaymentAction';
import { getInterfaceByExtensionHash } from '~interfaces';
import { Extension, getExtensionHash } from '@colony/colony-js';

export const handleStreamingPaymentEndTimeSet: EventHandler = async (
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

  await handleEditOrCancelStreamingPaymentAction({
    event,
    streamingPaymentsInterface,
    colonyAddress,
  });
};
