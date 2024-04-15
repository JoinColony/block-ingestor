import { Extension, getExtensionHash } from '@colony/colony-js';

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
    );
  }
};

export const setupMotionsListeners = (
  votingReputationAddress: string,
  colonyAddress: string,
): void => {
  const motionEvents = [
    ContractEventsSignatures.MotionCreated,
    ContractEventsSignatures.MotionStaked,
    ContractEventsSignatures.MotionFinalized,
    ContractEventsSignatures.MotionRewardClaimed,
    ContractEventsSignatures.MotionVoteSubmitted,
    ContractEventsSignatures.MotionVoteRevealed,
    ContractEventsSignatures.MotionEventSet,
  ];

  motionEvents.forEach((eventSignature) =>
    addExtensionEventListener(
      eventSignature,
      Extension.VotingReputation,
      votingReputationAddress,
      colonyAddress,
    ),
  );
};
