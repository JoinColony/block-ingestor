import { Extension, getExtensionHash } from '@colony/colony-js';
import {
  handlePaymentTokenUpdated,
  handleStreamingPaymentCreated,
} from '~handlers';

import { ContractEventsSignatures } from '@joincolony/blocks';
import { output } from '@joincolony/utils';

import { addExtensionEventListener, fetchExistingExtensions } from './index';

export const setupListenersForStreamingPaymentsExtensions =
  async (): Promise<void> => {
    output(`Setting up listeners for StreamingPayments extensions`);
    const existingExtensions = await fetchExistingExtensions(
      getExtensionHash(Extension.StreamingPayments),
    );
    existingExtensions.forEach((extension) =>
      setupListenersForStreamingPayments(extension.id, extension.colonyId),
    );
  };

export const setupListenersForStreamingPayments = (
  streamingPaymentsAddress: string,
  colonyAddress: string,
): void => {
  const eventHandlers = {
    [ContractEventsSignatures.StreamingPaymentCreated]:
      handleStreamingPaymentCreated,
    [ContractEventsSignatures.PaymentTokenUpdated]: handlePaymentTokenUpdated,
  };

  Object.entries(eventHandlers).forEach(([eventSignature, handler]) =>
    addExtensionEventListener(
      eventSignature as ContractEventsSignatures,
      Extension.StreamingPayments,
      streamingPaymentsAddress,
      colonyAddress,
      handler,
    ),
  );
};
