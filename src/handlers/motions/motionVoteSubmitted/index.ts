import { ExtensionEventListener } from '~eventListeners';
import { EventHandler } from '~types';
import { getActionByMotionId, getVotingClient, verbose } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';
import { getUpdatedVoterRecord } from './helpers';
import { MotionState } from '@colony/colony-js';
import {
  getNotificationCategory,
  sendMotionNotifications,
} from '~utils/notifications';
import { ColonyActionType, NotificationType } from '~graphql';

export const handleMotionVoteSubmitted: EventHandler = async (
  event,
  listener,
) => {
  const {
    args: { motionId, voter },
    blockNumber,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const { repSubmitted } = await votingClient.getMotion(motionId, {
    blockTag: blockNumber,
  });
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const votedMotion = await getMotionFromDB(motionDatabaseId);

  if (votedMotion) {
    const { voterRecord } = votedMotion;

    const updatedVoterRecord = getUpdatedVoterRecord(voterRecord, voter);
    await updateMotionInDB({
      ...votedMotion,
      voterRecord: updatedVoterRecord,
      repSubmitted: repSubmitted.toString(),
      motionStateHistory: {
        ...votedMotion.motionStateHistory,
        hasVoted: true,
      },
    });

    const motionState = await votingClient.getMotionState(motionId);

    // If this vote has pushed the motion into the reveal stage, trigger the reveal notification.
    if (
      motionState === MotionState.Reveal &&
      !votedMotion.motionStateHistory.inRevealPhase
    ) {
      const colonyAction = await getActionByMotionId(votedMotion.id);
      const notificationCategory = getNotificationCategory(colonyAction?.type);

      if (
        notificationCategory &&
        colonyAction &&
        colonyAction.type !== ColonyActionType.FundExpenditureMotion
      ) {
        sendMotionNotifications({
          colonyAddress,
          creator: colonyAction.initiatorAddress,
          notificationCategory,
          notificationType: NotificationType.MotionReveal,
          transactionHash: votedMotion.transactionHash,
        });
      }
    }

    verbose(`User: ${voter} voted on motion ${motionId.toString()}`);
  }
};
