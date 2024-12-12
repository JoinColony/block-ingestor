import { Extension, getExtensionHash } from '@colony/colony-js';
import {
  handleExpenditureMadeStaged,
  handleStagedPaymentReleased,
} from '~handlers';

import { ContractEventsSignatures } from '@joincolony/blocks';
import { output } from '@joincolony/utils';

import { addExtensionEventListener, fetchExistingExtensions } from './index';

export const setupListenersForStagedExpenditureExtensions =
  async (): Promise<void> => {
    output(`Setting up listeners for StagedExpenditure extensions`);
    const existingExtensions = await fetchExistingExtensions(
      getExtensionHash(Extension.StagedExpenditure),
    );
    existingExtensions.forEach((extension) =>
      setupListenersForStagedExpenditure(extension.id, extension.colonyId),
    );
  };

export const setupListenersForStagedExpenditure = (
  stagedExpenditureAddress: string,
  colonyAddress: string,
): void => {
  const eventHandlers = {
    [ContractEventsSignatures.ExpenditureMadeStaged]:
      handleExpenditureMadeStaged,
    [ContractEventsSignatures.StagedPaymentReleased]:
      handleStagedPaymentReleased,
  };

  Object.entries(eventHandlers).forEach(([eventSignature, handler]) =>
    addExtensionEventListener(
      eventSignature as ContractEventsSignatures,
      Extension.StagedExpenditure,
      stagedExpenditureAddress,
      colonyAddress,
      handler,
    ),
  );
};
