import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { output } from '~utils';

import { addExtensionEventListener, fetchExistingExtensions } from './index';

export const setupListenersForStakedExpenditureExtensions =
  async (): Promise<void> => {
    output(`Setting up listeners for StakedExpenditure extensions`);
    const existingExtensions = await fetchExistingExtensions(
      getExtensionHash(Extension.StakedExpenditure),
    );
    existingExtensions.forEach((extension) =>
      setupListenersForStakedExpenditure(
        extension.id,
        extension.colonyId,
        extension.isInitialized,
      ),
    );
  };

export const setupListenersForStakedExpenditure = (
  stakedExpenditureAddress: string,
  colonyAddress: string,
  isInitialized: boolean,
): void => {
  if (isInitialized) {
    const events = [
      ContractEventsSignatures.StakeReclaimed,
      ContractEventsSignatures.ExpenditureCancelled,
      ContractEventsSignatures.ExpenditureStakerPunished,
      ContractEventsSignatures.ExpenditureMadeViaStake,
      ContractEventsSignatures.StakeFractionSet,
    ];

    events.forEach((eventSignature) =>
      addExtensionEventListener(
        eventSignature,
        Extension.StakedExpenditure,
        stakedExpenditureAddress,
        colonyAddress,
      ),
    );
  } else {
    addExtensionEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      Extension.StagedExpenditure,
      stakedExpenditureAddress,
      colonyAddress,
    );
  }
};
