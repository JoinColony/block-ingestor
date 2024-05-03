import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { output } from '~utils';

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
  const events = [
    ContractEventsSignatures.StreamingPaymentCreated,
    ContractEventsSignatures.PaymentTokenUpdated,
    ContractEventsSignatures.StartTimeSet,
    ContractEventsSignatures.EndTimeSet,
    ContractEventsSignatures.ClaimWaived,
  ];

  events.forEach((eventSignature) =>
    addExtensionEventListener(
      eventSignature,
      Extension.StreamingPayments,
      streamingPaymentsAddress,
      colonyAddress,
    ),
  );
};
