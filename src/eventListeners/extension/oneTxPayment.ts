import { utils } from 'ethers';
import { Extension } from '@colony/colony-js';
import { output } from '~utils';
import { ContractEventsSignatures } from '~types';
import { addEventListener } from '../eventListeners';
import { EventListenerType } from '../types';
import { fetchExistingExtensions } from '.';

export const setupListenerForOneTxPayment = async (
  extensionAddress: string,
  colonyAddress: string,
): Promise<void> => {
  addEventListener({
    type: EventListenerType.OneTxPayment,
    eventSignature: ContractEventsSignatures.OneTxPaymentMade,
    address: extensionAddress,
    colonyAddress,
    topics: [utils.id(ContractEventsSignatures.OneTxPaymentMade)],
  });
};

export const setupListenerForOneTxPaymentExtensions =
  async (): Promise<void> => {
    output(`Setting up listener for OneTxPayment extensions`);
    const existingExtensions = await fetchExistingExtensions(
      Extension.OneTxPayment,
    );

    existingExtensions.forEach((extension) =>
      setupListenerForOneTxPayment(extension.id, extension.colonyId),
    );
  };
