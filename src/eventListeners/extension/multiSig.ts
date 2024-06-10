import { Extension, getExtensionHash } from '@colony/colony-js';
import { handleManagePermissionsAction } from '~handlers';
import {
  handleMultiSigApprovalChanged,
  handleMultiSigDomainSkillThresholdSet,
  handleMultiSigGlobalThresholdSet,
  handleMultiSigMotionCancelled,
  handleMultiSigMotionCreated,
  handleMultiSigMotionExecuted,
} from '~handlers/multiSig';

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
  const multiSigEvents = {
    [ContractEventsSignatures.MultisigMotionExecuted]:
      handleMultiSigMotionExecuted,
    [ContractEventsSignatures.MultisigMotionCancelled]:
      handleMultiSigMotionCancelled,
    [ContractEventsSignatures.MultisigMotionCreated]:
      handleMultiSigMotionCreated,
    [ContractEventsSignatures.MultisigApprovalChanged]:
      handleMultiSigApprovalChanged,
    [ContractEventsSignatures.MultisigRoleSet]: handleManagePermissionsAction,
    // [ContractEventsSignatures.MultisigRejectionChanged]: () => {},
    [ContractEventsSignatures.MultisigGlobalThresholdSet]:
      handleMultiSigGlobalThresholdSet,
    [ContractEventsSignatures.MultisigDomainSkillThresholdSet]:
      handleMultiSigDomainSkillThresholdSet,
  };

  Object.entries(multiSigEvents).forEach(([eventSignature, handler]) =>
    addExtensionEventListener(
      eventSignature as ContractEventsSignatures,
      Extension.MultisigPermissions,
      multiSigAddress,
      colonyAddress,
      handler,
    ),
  );
};
