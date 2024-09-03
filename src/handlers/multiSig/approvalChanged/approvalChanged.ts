import { ExtensionEventListener } from '~eventListeners';
import { MultiSigVote } from '~graphql';
import { getChainId } from '~provider';
import { EventHandler } from '~types';
import {
  addMultiSigVote,
  getMultiSigDatabaseId,
  getMultiSigFromDB,
  getMultisigNotificationCategory,
  getUserMultiSigSignature,
  removeMultiSigVote,
} from '../helpers';
import { getMultiSigClient } from '~utils';
import {
  NotificationType,
  sendMultisigActionNotifications,
} from '~utils/notifications';

export const handleMultiSigApprovalChanged: EventHandler = async (
  event,
  listener,
) => {
  const { contractAddress: multiSigExtensionAddress, timestamp } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

  const chainId = getChainId();
  const { agent: userAddress, motionId, role, approval } = event.args;

  const multiSigClient = await getMultiSigClient(colonyAddress);

  const multiSigId = getMultiSigDatabaseId(
    chainId,
    multiSigExtensionAddress,
    motionId,
  );

  const existingVote = await getUserMultiSigSignature({
    multiSigId,
    userAddress,
    vote: MultiSigVote.Approve,
    role,
  });

  if (!approval) {
    if (existingVote) {
      await removeMultiSigVote(existingVote?.id);
    }
  } else {
    if (!existingVote) {
      await addMultiSigVote({
        multiSigId,
        role,
        userAddress,
        colonyAddress,
        vote: MultiSigVote.Approve,
        timestamp,
      });
    }
  }

  if (multiSigClient) {
    const motion = await multiSigClient.getMotion(motionId);
    const multiSigFromDB = await getMultiSigFromDB(multiSigId);

    const notificationCategory = await getMultisigNotificationCategory(
      multiSigFromDB?.action?.type,
    );

    if (notificationCategory && !motion.overallApprovalTimestamp.isZero()) {
      sendMultisigActionNotifications({
        colonyAddress,
        creator: userAddress,
        notificationCategory,
        notificationType: NotificationType.MultiSigActionApproved,
        transactionHash: multiSigFromDB?.transactionHash,
      });
    }
  }
};
