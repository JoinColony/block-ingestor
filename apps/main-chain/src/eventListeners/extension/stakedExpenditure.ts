import { Extension, getExtensionHash } from '@colony/colony-js';
import {
  handleExpenditureCancelled,
  handleExpenditureMadeViaStake,
  handleExpenditureStakerPunished,
  handleExtensionInitialised,
  handleStakeFractionSet,
  handleStakeReclaimed,
} from '~handlers';

import { ContractEventsSignatures } from '@joincolony/blocks';
import { output } from '@joincolony/utils';

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
    const eventHandlers = {
      [ContractEventsSignatures.StakeReclaimed]: handleStakeReclaimed,
      [ContractEventsSignatures.ExpenditureCancelled]:
        handleExpenditureCancelled,
      [ContractEventsSignatures.ExpenditureStakerPunished]:
        handleExpenditureStakerPunished,
      [ContractEventsSignatures.ExpenditureMadeViaStake]:
        handleExpenditureMadeViaStake,
      [ContractEventsSignatures.StakeFractionSet]: handleStakeFractionSet,
    };

    Object.entries(eventHandlers).forEach(([eventSignature, handler]) =>
      addExtensionEventListener(
        eventSignature as ContractEventsSignatures,
        Extension.StakedExpenditure,
        stakedExpenditureAddress,
        colonyAddress,
        handler,
      ),
    );
  } else {
    addExtensionEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      Extension.StagedExpenditure,
      stakedExpenditureAddress,
      colonyAddress,
      handleExtensionInitialised,
    );
  }
};
