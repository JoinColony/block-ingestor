import { BigNumber } from 'ethers';
import { ExtensionEventListener } from '~eventListeners';
import { MultiSigVote, NotificationType } from '@joincolony/graphql';
import { getChainId } from '~provider';
import { EventHandler } from '~types';
import {
  addMultiSigVote,
  getMultiSigDatabaseId,
  getMultiSigFromDB,
  getUserMultiSigSignature,
  removeMultiSigVote,
} from '../helpers';
import { getMultiSigClient } from '~utils';
import {
  getNotificationCategory,
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

    const notificationCategory = getNotificationCategory(
      multiSigFromDB?.action?.type,
    );

    let hasFullApproval = true;
    let roleIndex = 0;

    // Map over each permission.
    while (
      BigNumber.from(motion.requiredPermissions).gte(
        BigNumber.from(1).shl(roleIndex),
      )
    ) {
      // If the permission is required by this multi sig motion...
      // (this logic is taken from the network, it's very cool I know)
      if (
        BigNumber.from(motion.requiredPermissions)
          .and(BigNumber.from(1).shl(roleIndex))
          .gt(BigNumber.from(0))
      ) {
        // Get the threshold for this role from the multi sig motion.
        const thresholdForRole = await multiSigClient.getMotionVoteThreshold(
          motionId,
          role,
        );

        // Get the number of signatures for this role that have voted approve.
        const approvalsForRole =
          multiSigFromDB?.signatures?.items.filter(
            (signature) =>
              signature?.role === roleIndex &&
              signature.vote === MultiSigVote.Approve,
          ) ?? [];

        // If the number of approval signatures for this role is less than the threshold, then the multi sig motion has not reached full approval.
        if (thresholdForRole.gt(BigNumber.from(approvalsForRole.length))) {
          hasFullApproval = false;
        }
      }
      roleIndex += 1;
    }

    if (notificationCategory && hasFullApproval) {
      sendMultisigActionNotifications({
        colonyAddress,
        creator: userAddress,
        notificationCategory,
        notificationType: NotificationType.MultisigActionApproved,
        transactionHash: multiSigFromDB?.transactionHash,
      });
    }
  }
};
