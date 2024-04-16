import { Extension, getExtensionHash } from '@colony/colony-js';
import { handleExtensionInitialised } from '~handlers';

import { ContractEventsSignatures } from '~types';
import { output } from '~utils';

import { addExtensionEventListener, fetchExistingExtensions } from './index';

export const setupListenersForMultiSigExtensions = async (): Promise<void> => {
  output(`Setting up listeners for MultiSig extensions`);
  const existingExtensions = await fetchExistingExtensions(
    getExtensionHash(Extension.MultisigPermissions),
  );
  existingExtensions.forEach((extension) =>
    setupListenersForMultiSig(
      extension.id,
      extension.colonyId,
      extension.isInitialized,
    ),
  );
};

export const setupListenersForMultiSig = (
  votingReputationAddress: string,
  colonyAddress: string,
  isInitialized: boolean,
): void => {
  if (isInitialized) {
    setupMotionsListeners(votingReputationAddress, colonyAddress);
  } else {
    addExtensionEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      Extension.MultisigPermissions,
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
  const motionEvents = [
    ContractEventsSignatures.MultisigRoleSet,
    ContractEventsSignatures.MultisigMotionExecuted,
    ContractEventsSignatures.MultisigMotionCancelled,
    ContractEventsSignatures.MultisigMotionCreated,
    ContractEventsSignatures.MultisigApprovalChanged,
    ContractEventsSignatures.MultisigRejectionChanged,
    ContractEventsSignatures.MultisigGlobalThresholdSet,
    ContractEventsSignatures.MultisigDomainSkillThresholdSet,
  ];

  motionEvents.forEach((eventSignature) =>
    addExtensionEventListener(
      eventSignature,
      Extension.MultisigPermissions,
      votingReputationAddress,
      colonyAddress,
      () => {},
    ),
  );
};
