import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { addExtensionEventListener, fetchExistingExtensions } from './index';
import { output } from '~utils';

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
  addExtensionEventListener(
    ContractEventsSignatures.StreamingPaymentCreated,
    Extension.StreamingPayments,
    streamingPaymentsAddress,
    colonyAddress,
  );
};
