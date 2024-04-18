import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { output } from '~utils/logger';

import { addExtensionEventListener, fetchExistingExtensions } from './index';

export const setupListenersForMultiSigExtensions = async (): Promise<void> => {
  output(`Setting up listeners for MultiSig extensions`);
  const existingExtensions = await fetchExistingExtensions(
    getExtensionHash(Extension.MultisigPermissions),
  );
  existingExtensions.forEach((extension) =>
    setupMultiSigListeners(extension.id, extension.colonyId),
  );
};

export const handleMultiSigInstalled = (
  votingReputationAddress: string,
  colonyAddress: string,
): void => {
  setupMultiSigListeners(votingReputationAddress, colonyAddress);
};

export const setupMultiSigListeners = (
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
    ),
  );
};
