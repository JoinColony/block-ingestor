import { Extension, getExtensionHash } from '@colony/colony-js';
import { constants } from 'ethers';
import { removeExtensionEventListeners } from '~eventListeners';
import { handleMultiSigUninstalled } from '~eventListeners/extension/multiSig';
import { NotificationType } from '@joincolony/graphql';
import networkClient from '~networkClient';
import { ContractEvent } from '@joincolony/blocks';
import { deleteExtensionFromEvent } from '~utils';
import { sendExtensionUpdateNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress, transactionHash } = event;
  const { extensionId: extensionHash, colony: colonyAddress } = event.args;

  await deleteExtensionFromEvent(event);
  removeExtensionEventListeners(extensionAddress);

  const receipt = await networkClient.provider.getTransactionReceipt(
    transactionHash,
  );

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: receipt.from || constants.AddressZero,
    notificationType: NotificationType.ExtensionUninstalled,
    extensionHash,
  });

  if (extensionHash === getExtensionHash(Extension.MultisigPermissions)) {
    await handleMultiSigUninstalled(colonyAddress);
  }
};
