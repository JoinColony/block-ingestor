import { Extension, getExtensionHash } from '@colony/colony-js';
import { removeExtensionEventListeners } from '~eventListeners';
import { handleMultiSigUninstalled } from '~eventListeners/extension/multiSig';
import { ContractEvent } from '~types';
import { deleteExtensionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;
  const { extensionId: extensionHash, colony: colonyAddress } = event.args;

  await deleteExtensionFromEvent(event);
  removeExtensionEventListeners(extensionAddress);

  if (extensionHash === getExtensionHash(Extension.MultisigPermissions)) {
    await handleMultiSigUninstalled(colonyAddress);
  }
};
