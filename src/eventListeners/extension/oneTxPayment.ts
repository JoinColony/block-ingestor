import { Extension, getExtensionHash } from '@colony/colony-js';
import { output } from '~utils';
import { ContractEventsSignatures } from '~types';

import { addExtensionEventListener, fetchExistingExtensions } from '.';

export const setupListenerForOneTxPayment = async (
  extensionAddress: string,
  colonyAddress: string,
): Promise<void> => {
  addExtensionEventListener(
    ContractEventsSignatures.OneTxPaymentMade,
    Extension.OneTxPayment,
    extensionAddress,
    colonyAddress,
  );
};

export const setupListenerForOneTxPaymentExtensions =
  async (): Promise<void> => {
    output(`Setting up listener for OneTxPayment extensions`);
    const existingExtensions = await fetchExistingExtensions(
      getExtensionHash(Extension.OneTxPayment),
    );

    existingExtensions.forEach((extension) =>
      setupListenerForOneTxPayment(extension.id, extension.colonyId),
    );
  };
