import { mutate } from '~amplifyClient';
import {
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigInput,
  UpdateColonyMultiSigMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import { verbose } from '~utils';
import {
  getMultiSigDatabaseId,
  getMultiSigFromDB,
  getMultisigNotificationCategory,
} from './helpers';
import { getChainId } from '~provider';
import { getBlockChainTimestampISODate } from '~utils/dates';
import {
  NotificationType,
  sendMultisigActionNotifications,
} from '~utils/notifications';
import { ExtensionEventListener } from '~eventListeners';

export const handleMultiSigMotionCancelled: EventHandler = async (
  event,
  listener,
) => {
  const {
    args: { motionId, agent: userAddress },
    contractAddress: multiSigExtensionAddress,
    timestamp,
  } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

  const chainId = getChainId();

  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigExtensionAddress,
    motionId,
  );

  verbose(`MultiSig motion: ${motionId} has been rejected`);

  await mutate<
    UpdateColonyMultiSigInput,
    UpdateColonyMultiSigMutationVariables
  >(UpdateColonyMultiSigDocument, {
    input: {
      id: multiSigDatabaseId,
      hasActionCompleted: false,
      isRejected: true,
      rejectedAt: getBlockChainTimestampISODate(timestamp),
      rejectedBy: userAddress,
    },
  });

  const multiSigFromDB = await getMultiSigFromDB(multiSigDatabaseId);

  if (!multiSigFromDB) {
    return;
  }

  const notificationCategory = await getMultisigNotificationCategory(
    multiSigDatabaseId,
  );

  if (notificationCategory) {
    sendMultisigActionNotifications({
      colonyAddress,
      creator: userAddress,
      notificationCategory,
      notificationType: NotificationType.MultiSigActionRejected,
      transactionHash: multiSigFromDB?.transactionHash,
    });
  }
};
