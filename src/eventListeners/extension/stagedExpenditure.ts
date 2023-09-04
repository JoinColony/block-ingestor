import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { output } from '~utils';

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
  addExtensionEventListener(
    ContractEventsSignatures.ExpenditureMadeStaged,
    Extension.StagedExpenditure,
    stagedExpenditureAddress,
    colonyAddress,
  );
};
