import { ExtensionEventListener } from '~eventListeners';
import { EventHandler, MotionSide } from '~types';
import { verbose, getVotingClient, getActionByMotionId } from '~utils';
import { getBlockChainTimestampISODate } from '~utils/dates';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
  getUpdatedUsersStakes,
  getUpdatedMessages,
  updateMotionInDB,
  getMessageKey,
  updateUserStake,
} from '../helpers';
import {
  getNotificationCategory,
  sendMotionNotifications,
} from '~utils/notifications';
import { MotionNotificationVariables } from '~types/notifications';
import { NotificationType } from '@joincolony/graphql';

export const handleMotionStaked: EventHandler = async (
  event,
  listener,
): Promise<void> => {
  const {
    logIndex,
    transactionHash,
    args: { vote, amount, staker, motionId },
    timestamp,
    blockNumber,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const totalStakeFraction = await votingClient.getTotalStakeFraction({
    blockTag: blockNumber,
  });
  const { skillRep, stakes } = await votingClient.getMotion(motionId, {
    blockTag: blockNumber,
  });

  const requiredStake = getRequiredStake(skillRep, totalStakeFraction);
  const motionStakes = getMotionStakes(requiredStake, stakes, vote);
  const remainingStakes = getRemainingStakes(requiredStake, stakes);
  const showInActionsList =
    Number(motionStakes.percentage.yay) + Number(motionStakes.percentage.nay) >=
    10;
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const stakedMotion = await getMotionFromDB(motionDatabaseId);

  if (stakedMotion) {
    const { usersStakes } = stakedMotion;

    const updatedUserStakes = getUpdatedUsersStakes(
      usersStakes,
      staker,
      vote,
      amount,
      requiredStake,
    );
    const newMotionMessages = getUpdatedMessages({
      motionData: stakedMotion,
      requiredStake,
      motionStakes,
      messageKey: getMessageKey(transactionHash, logIndex),
      vote,
      staker,
      amount,
    });

    const yaySideFullyStaked = requiredStake.eq(motionStakes.raw.yay);
    const naySideFullyStaked = requiredStake.eq(motionStakes.raw.nay);
    const stakerSide = getMotionSide(vote);

    await updateMotionInDB(
      {
        ...stakedMotion,
        usersStakes: updatedUserStakes,
        motionStakes,
        remainingStakes,
        motionStateHistory: {
          ...stakedMotion.motionStateHistory,
          yaySideFullyStakedAt:
            yaySideFullyStaked && stakerSide === MotionSide.YAY
              ? getBlockChainTimestampISODate(timestamp)
              : stakedMotion.motionStateHistory.yaySideFullyStakedAt,
          naySideFullyStakedAt:
            naySideFullyStaked && stakerSide === MotionSide.NAY
              ? getBlockChainTimestampISODate(timestamp)
              : stakedMotion.motionStateHistory.naySideFullyStakedAt,
        },
      },
      newMotionMessages,
      showInActionsList,
    );

    await updateUserStake(
      stakedMotion.transactionHash,
      staker,
      colonyAddress,
      amount,
      timestamp,
    );

    const newlyFullySupported =
      !stakedMotion.motionStateHistory.yaySideFullyStakedAt &&
      yaySideFullyStaked;
    const newlyFullyOpposed =
      !stakedMotion.motionStateHistory.naySideFullyStakedAt &&
      naySideFullyStaked;
    const newlyInVoting =
      (!!stakedMotion.motionStateHistory.naySideFullyStakedAt ||
        !!stakedMotion.motionStateHistory.yaySideFullyStakedAt) &&
      yaySideFullyStaked &&
      naySideFullyStaked;

    if (newlyFullySupported || newlyFullyOpposed || newlyInVoting) {
      const colonyAction = await getActionByMotionId(stakedMotion.id);
      const notificationCategory = getNotificationCategory(colonyAction?.type);
      let notificationType:
        | MotionNotificationVariables['notificationType']
        | null = null;

      if (newlyFullyOpposed) {
        notificationType = NotificationType.MotionOpposed;
      }
      if (newlyFullySupported) {
        notificationType = NotificationType.MotionSupported;
      }
      if (newlyInVoting) {
        notificationType = NotificationType.MotionVoting;
      }

      if (notificationCategory && notificationType && colonyAction) {
        sendMotionNotifications({
          colonyAddress,
          creator: colonyAction.initiatorAddress,
          notificationCategory,
          notificationType,
          transactionHash: stakedMotion.transactionHash,
          expenditureID: stakedMotion.expenditureId ?? undefined,
        });
      }
    }

    verbose(
      `User: ${staker} staked motion ${motionId.toString()} by ${amount.toString()} on side ${stakerSide}`,
    );
  }
};
