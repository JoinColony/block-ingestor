import { Extension, getExtensionHash } from '@colony/colony-js';
import { constants } from 'ethers';
import { removeExtensionEventListeners } from '~eventListeners';
import { handleMultiSigUninstalled } from '~eventListeners/extension/multiSig';
import { NotificationType } from '@joincolony/graphql';
import provider from '~provider';
import { ContractEvent } from '~types';
import { deleteExtensionFromEvent } from '~utils';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
import { getTransactionSignerAddress } from '~utils/transactions';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress, transactionHash } = event;
  const { extensionId: extensionHash, colony: colonyAddress } = event.args;

  await deleteExtensionFromEvent(event);
  removeExtensionEventListeners(extensionAddress);

  const transaction = await provider.getTransaction(transactionHash);

  const uninstalledBy =
    getTransactionSignerAddress(transaction) ?? constants.AddressZero;

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: uninstalledBy,
    notificationType: NotificationType.ExtensionUninstalled,
    extensionHash,
  });

  if (extensionHash === getExtensionHash(Extension.MultisigPermissions)) {
    await handleMultiSigUninstalled(colonyAddress);
  }
};
