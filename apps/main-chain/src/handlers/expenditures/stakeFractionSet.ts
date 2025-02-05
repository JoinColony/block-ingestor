import { constants } from 'ethers';
import { NotificationType } from '@joincolony/graphql';
import networkClient from '~networkClient';
import { updateExtension } from '~utils/extensions/updateExtension';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
import { getTransactionSignerAddress } from '~utils/transactions';
import provider from '~provider';
import { EventHandler } from '@joincolony/blocks';

export const handleStakeFractionSet: EventHandler = async (
  event,
): Promise<void> => {
  const { contractAddress: extensionAddress, transactionHash } = event;
  const { stakeFraction } = event.args;

  const mutationResult = await updateExtension(extensionAddress, {
    params: {
      stakedExpenditure: {
        stakeFraction: stakeFraction.toString(),
      },
    },
  });

  const extensionHash = mutationResult?.updateColonyExtension?.extensionHash;
  const colonyAddress = mutationResult?.updateColonyExtension?.colonyAddress;

  if (!colonyAddress) {
    return;
  }

  const transaction = await provider
    .getProviderInstance()
    .getTransaction(transactionHash);

  const installedBy =
    getTransactionSignerAddress(transaction) ?? constants.AddressZero;

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: installedBy,
    notificationType: NotificationType.ExtensionSettingsChanged,
    extensionHash,
  });
};
