import amplifyClient from '~amplifyClient';
import {
  NotificationType,
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigInput,
  UpdateColonyMultiSigMutationVariables,
} from '@joincolony/graphql';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';
import { verbose } from '@joincolony/utils';
import { getMultiSigDatabaseId, getMultiSigFromDB } from './helpers';
import rpcProvider from '~provider';
import { getBlockChainTimestampISODate } from '~utils/dates';
import {
  getNotificationCategory,
  sendMultisigActionNotifications,
} from '~utils/notifications';

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

  const chainId = rpcProvider.getChainId();

  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigExtensionAddress,
    motionId,
  );

  verbose(`MultiSig motion: ${motionId} has been rejected`);

  await amplifyClient.mutate<
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

  const notificationCategory = getNotificationCategory(
    multiSigFromDB?.action?.type,
  );

  if (notificationCategory) {
    sendMultisigActionNotifications({
      colonyAddress,
      creator: userAddress,
      notificationCategory,
      notificationType: NotificationType.MultisigActionRejected,
      transactionHash: multiSigFromDB?.transactionHash,
      expenditureID: multiSigFromDB?.expenditureId ?? undefined,
    });
  }
};
