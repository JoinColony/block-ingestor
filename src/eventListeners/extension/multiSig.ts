import { Extension, getExtensionHash } from '@colony/colony-js';
import { handleExtensionInitialised } from '~handlers';
import { handleMultiSigGlobalThresholdUpdated } from '~handlers/multiSig';

import { ContractEventsSignatures } from '~types';
import { addMultiSigParamsToDB } from '~utils/extensions/multiSig';
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

export const handleMultiSigInstalled = async (
  multiSigAddress: string,
  colonyAddress: string,
): Promise<void> => {
  await addMultiSigParamsToDB(multiSigAddress, colonyAddress);
  setupMultiSigListeners(multiSigAddress, colonyAddress);
};

export const setupMultiSigListeners = (
  multiSigAddress: string,
  colonyAddress: string,
): void => {
  const motionEvents = {
    [ContractEventsSignatures.MultisigRoleSet]: () => {},
    [ContractEventsSignatures.MultisigMotionExecuted]: () => {},
    [ContractEventsSignatures.MultisigMotionCancelled]: () => {},
    [ContractEventsSignatures.MultisigMotionCreated]: () => {},
    [ContractEventsSignatures.MultisigApprovalChanged]: () => {},
    [ContractEventsSignatures.MultisigRejectionChanged]: () => {},
    [ContractEventsSignatures.MultisigGlobalThresholdSet]:
      handleMultiSigGlobalThresholdUpdated,
    [ContractEventsSignatures.MultisigDomainSkillThresholdSet]: () => {},
  };

  Object.entries(motionEvents).forEach(([eventSignature, handler]) =>
    addExtensionEventListener(
      eventSignature,
      Extension.MultisigPermissions,
      multiSigAddress,
      colonyAddress,
      handler,
    ),
  );
};
