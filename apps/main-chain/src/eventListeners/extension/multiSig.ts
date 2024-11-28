import { Extension, getExtensionHash } from '@colony/colony-js';
import { handleManagePermissionsAction } from '~handlers';
import {
  handleMultiSigApprovalChanged,
  handleMultiSigRejectionChanged,
  handleMultiSigDomainSkillThresholdSet,
  handleMultiSigGlobalThresholdSet,
  handleMultiSigMotionCancelled,
  handleMultiSigMotionCreated,
  handleMultiSigMotionExecuted,
} from '~handlers/multiSig';
import { mutate, query } from '~amplifyClient';
import {
  GetActiveColonyMultisigsDocument,
  GetActiveColonyMultisigsQuery,
  GetActiveColonyMultisigsQueryVariables,
  GetAllMultiSigRolesDocument,
  GetAllMultiSigRolesQuery,
  GetAllMultiSigRolesQueryVariables,
  RemoveMultiSigRoleDocument,
  RemoveMultiSigRoleMutation,
  RemoveMultiSigRoleMutationVariables,
} from '@joincolony/graphql';

import { ContractEventsSignatures } from '~types';
import { notNull } from '~utils';
import { addMultiSigParamsToDB } from '~utils/extensions/multiSig';
import { output } from '~utils/logger';

import { addExtensionEventListener, fetchExistingExtensions } from './index';
import { updateMultiSigInDB } from '~handlers/multiSig/helpers';

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
  setupMultiSigListeners(multiSigAddress, colonyAddress);
  await addMultiSigParamsToDB(multiSigAddress, colonyAddress);
};

export const handleMultiSigUninstalled = async (
  colonyAddress: string,
): Promise<void> => {
  const multiSigRolesQuery = await query<
    GetAllMultiSigRolesQuery,
    GetAllMultiSigRolesQueryVariables
  >(GetAllMultiSigRolesDocument, {
    colonyAddress,
  });

  const roleEntries = multiSigRolesQuery?.data?.getRoleByColony?.items ?? [];

  await Promise.all(
    roleEntries.filter(notNull).map(async (entry) => {
      await mutate<
        RemoveMultiSigRoleMutation,
        RemoveMultiSigRoleMutationVariables
      >(RemoveMultiSigRoleDocument, {
        id: entry.id,
      });
    }),
  );

  const activeMultiSigsQuery = await query<
    GetActiveColonyMultisigsQuery,
    GetActiveColonyMultisigsQueryVariables
  >(GetActiveColonyMultisigsDocument, {
    colonyAddress,
  });

  const multiSigs =
    activeMultiSigsQuery?.data?.getMultiSigByColonyAddress?.items ?? [];
  await Promise.all(
    multiSigs.filter(notNull).map(async (entry) => {
      await updateMultiSigInDB({
        id: entry.id,
        isExecuted: false,
        isRejected: true,
      });
    }),
  );
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
    [ContractEventsSignatures.MultisigRejectionChanged]:
      handleMultiSigRejectionChanged,
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
