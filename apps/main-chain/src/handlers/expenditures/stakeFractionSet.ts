import { constants } from 'ethers';
import { NotificationType } from '@joincolony/graphql';
import networkClient from '~networkClient';
import { updateExtension } from '~utils/extensions/updateExtension';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
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

  const receipt = await networkClient.provider.getTransactionReceipt(
    transactionHash,
  );

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: receipt.from || constants.AddressZero,
    notificationType: NotificationType.ExtensionSettingsChanged,
    extensionHash,
  });
};
