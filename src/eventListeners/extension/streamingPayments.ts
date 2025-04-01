import { Extension, getExtensionHash } from '@colony/colony-js';
import {
  handlePaymentTokenUpdated,
  handleStreamingPaymentClaimed,
  handleStreamingPaymentClaimWaived,
  handleStreamingPaymentCreated,
} from '~handlers';
import {
  handleStreamingPaymentStartTimeSet,
  handleStreamingPaymentEndTimeSet,
} from '~handlers/expenditures/index';

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
  const eventHandlers = {
    [ContractEventsSignatures.StreamingPaymentCreated]:
      handleStreamingPaymentCreated,
    [ContractEventsSignatures.PaymentTokenUpdated]: handlePaymentTokenUpdated,
    [ContractEventsSignatures.StartTimeSet]: handleStreamingPaymentStartTimeSet,
    [ContractEventsSignatures.EndTimeSet]: handleStreamingPaymentEndTimeSet,
    [ContractEventsSignatures.StreamingPaymentClaimed]:
      handleStreamingPaymentClaimed,
    [ContractEventsSignatures.ClaimWaived]: handleStreamingPaymentClaimWaived,
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
