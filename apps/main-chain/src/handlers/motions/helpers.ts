import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  ColonyMotion,
  CreateMotionMessageDocument,
  CreateMotionMessageInput,
  GetColonyMotionDocument,
  GetColonyMotionQuery,
  GetColonyMotionQueryVariables,
  NotificationType,
  UpdateColonyActionDocument,
  UpdateColonyMotionDocument,
} from '@joincolony/graphql';
import { MotionSide, MotionVote } from '~types';
import { verbose, output } from '~utils';
import { getActionByMotionId } from '~utils/actions';
import { updateDecisionInDB } from '~utils/decisions';
import {
  getNotificationCategory,
  sendMentionNotifications,
  sendMotionNotifications,
} from '~utils/notifications';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(MotionVote.YAY) ? MotionSide.YAY : MotionSide.NAY;

export const updateMotionInDB = async (
  motionData: ColonyMotion,
  newMotionMessages?: CreateMotionMessageInput[],
  showInActionsList?: boolean,
): Promise<void> => {
  await mutate(UpdateColonyMotionDocument, {
    input: {
      ...motionData,
    },
  });

  if (newMotionMessages?.length) {
    for (const message of newMotionMessages) {
      await mutate(CreateMotionMessageDocument, {
        input: {
          ...message,
        },
      });
    }
  }

  if (showInActionsList !== undefined) {
    const colonyAction = await getActionByMotionId(motionData.id);

    if (!colonyAction) {
      verbose(
        'Could not find the action in the db. This is a bug and needs investigating.',
      );
    } else {
      await mutate(UpdateColonyActionDocument, {
        input: {
          id: colonyAction.id,
          showInActionsList,
        },
      });

      // If is decision
      if (colonyAction.colonyDecisionId) {
        await updateDecisionInDB(colonyAction.id, {
          showInDecisionsList: showInActionsList,
        });
      }

      const notificationCategory = getNotificationCategory(colonyAction?.type);

      // If the motion is newly being shown in the list, we can assume that it has just been staked
      // to at least 10%, which is also the threshold for sending a notification.
      if (
        !colonyAction.showInActionsList &&
        showInActionsList &&
        notificationCategory
      ) {
        sendMotionNotifications({
          colonyAddress: colonyAction.colonyId,
          creator: colonyAction.initiatorAddress,
          notificationCategory,
          notificationType: NotificationType.MotionCreated,
          transactionHash: colonyAction.id,
          expenditureID: motionData?.expenditureId ?? undefined,
        });

        // We don't want to send mention notifications if we have a FundExpenditureMotion motion
        if (colonyAction.type === ColonyActionType.FundExpenditureMotion) {
          return;
        }

        let recipients: string[] = [];

        if (
          colonyAction.recipientAddress &&
          [ColonyActionType.MultiplePaymentMotion].includes(colonyAction.type)
        ) {
          recipients =
            colonyAction.payments?.map((payment) => payment.recipientAddress) ??
            [];
        }

        if (
          colonyAction.recipientAddress &&
          [
            ColonyActionType.AddVerifiedMembersMotion,
            ColonyActionType.RemoveVerifiedMembersMotion,
          ].includes(colonyAction.type)
        ) {
          recipients = colonyAction.members ?? [];
        }

        if (
          colonyAction.recipientAddress &&
          [
            ColonyActionType.PaymentMotion,
            ColonyActionType.SetUserRolesMotion,
            ColonyActionType.EmitDomainReputationRewardMotion,
            ColonyActionType.EmitDomainReputationPenaltyMotion,
          ].includes(colonyAction.type)
        ) {
          recipients = colonyAction.recipientAddress
            ? [colonyAction.recipientAddress]
            : [];
        }

        if (recipients.length) {
          sendMentionNotifications({
            colonyAddress: colonyAction.colonyId,
            creator: colonyAction.initiatorAddress,
            transactionHash: colonyAction.id,
            recipients,
          });
        }
      }
    }
  }
};

export const getMotionDatabaseId = (
  chainId: number,
  votingRepExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${votingRepExtnAddress}_${nativeMotionId}`;

export const getMotionFromDB = async (
  databaseMotionId: string,
): Promise<ColonyMotion | null | undefined> => {
  const { data } =
    (await query<GetColonyMotionQuery, GetColonyMotionQueryVariables>(
      GetColonyMotionDocument,
      {
        id: databaseMotionId,
      },
    )) ?? {};

  const motion = data?.getColonyMotion;

  if (!motion) {
    output(
      'Could not find the motion in the db. This is a bug and needs investigating.',
    );
  }

  return motion;
};

export const getMessageKey = (
  transactionHash: string,
  logIndex: number,
): string => {
  return `${transactionHash}${logIndex}`;
};
