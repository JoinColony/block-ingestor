import { Extension, getExtensionHash } from '@colony/colony-js';
import {
  handleExtensionInitialised,
  handleMotionCreated,
  handleMotionEventSet,
  handleMotionFinalized,
  handleMotionRewardClaimed,
  handleMotionStaked,
  handleMotionVoteRevealed,
  handleMotionVoteSubmitted,
} from '~handlers';

import { ContractEventsSignatures } from '~types';
import { output } from '~utils';

import { addExtensionEventListener, fetchExistingExtensions } from './index';

export const setupListenersForVotingReputationExtensions =
  async (): Promise<void> => {
    output(`Setting up listeners for VotingReputation extensions`);
    const existingExtensions = await fetchExistingExtensions(
      getExtensionHash(Extension.VotingReputation),
    );
    existingExtensions.forEach((extension) =>
      setupListenersForVotingReputation(
        extension.id,
        extension.colonyId,
        extension.isInitialized,
      ),
    );
  };

export const setupListenersForVotingReputation = (
  votingReputationAddress: string,
  colonyAddress: string,
  isInitialized: boolean,
): void => {
  if (isInitialized) {
    setupMotionsListeners(votingReputationAddress, colonyAddress);
  } else {
    addExtensionEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      Extension.VotingReputation,
      votingReputationAddress,
      colonyAddress,
      handleExtensionInitialised,
    );
  }
};

export const setupMotionsListeners = (
  votingReputationAddress: string,
  colonyAddress: string,
): void => {
  const motionEventHandlers = {
    [ContractEventsSignatures.MotionCreated]: handleMotionCreated,
    [ContractEventsSignatures.MotionStaked]: handleMotionStaked,
    [ContractEventsSignatures.MotionFinalized]: handleMotionFinalized,
    [ContractEventsSignatures.MotionRewardClaimed]: handleMotionRewardClaimed,
    [ContractEventsSignatures.MotionVoteSubmitted]: handleMotionVoteSubmitted,
    [ContractEventsSignatures.MotionVoteRevealed]: handleMotionVoteRevealed,
    [ContractEventsSignatures.MotionEventSet]: handleMotionEventSet,
  };

  Object.entries(motionEventHandlers).forEach(([eventSignature, handler]) =>
    addExtensionEventListener(
      eventSignature as ContractEventsSignatures,
      Extension.VotingReputation,
      votingReputationAddress,
      colonyAddress,
      handler,
    ),
  );
};
