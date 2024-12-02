import MagicBellClient, { Notification } from '@magicbell/core';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  GetColonyContributorsNotificationDataDocument,
  GetColonyContributorsNotificationDataQuery,
  GetColonyContributorsNotificationDataQueryVariables,
  GetNotificationUsersDocument,
  GetNotificationUsersQuery,
  GetNotificationUsersQueryVariables,
  NotificationsDataFragment,
  NotificationType,
  NotificationUserFragment,
} from '@joincolony/graphql';
import { getAllColoniesWithRootPermissionHolders } from './colony';
import { getAllPagesOfData, GetDataFn } from './graphql';
import { isAddressExtension } from './extensions';
import {
  Recipient,
  PermissionsActionNotificationVariables,
  ExpenditureUpdateNotificationVariables,
  NotificationCategory,
  MultisigActionNotificationVariables,
  MentionNotificationVariables,
  NotificationVariables,
  MotionNotificationVariables,
  FundsClaimedNotificationVariables,
  ExtensionUpdateNotificationVariables,
  ExtensionVersionAddedNotificationVariables,
} from '~types/notifications';

const categoryToApiKey: Record<
  NotificationCategory,
  | 'adminNotificationsDisabled'
  | 'mentionNotificationsDisabled'
  | 'paymentNotificationsDisabled'
> = {
  [NotificationCategory.Admin]: 'adminNotificationsDisabled',
  [NotificationCategory.Mention]: 'mentionNotificationsDisabled',
  [NotificationCategory.Payment]: 'paymentNotificationsDisabled',
};

// Set up the notification client
export const setupNotificationsClient = async (): Promise<void> => {
  try {
    await MagicBellClient.createInstance({
      apiKey: process.env.MAGICBELL_API_KEY as string,
      apiSecret: process.env.MAGICBELL_API_SECRET as string,
    });
  } catch (error) {
    console.log('Error creating notification client: ', error);
  }
};

// Check if notifications should be sent to a recipient from a colony.
const shouldSendNotificationToRecipient = (
  notificationsData: NotificationsDataFragment,
  colonyAddress: string,
  noticationCategory: NotificationCategory,
): boolean => {
  return (
    !!notificationsData.magicbellUserId && // User has a magicbell user account made
    !notificationsData.notificationsDisabled && // User has not disabled notifications app-wide
    !notificationsData.mutedColonyAddresses.includes(colonyAddress) && // User has not muted the colony that the notification is in
    !notificationsData[categoryToApiKey[noticationCategory]] // User doesn't have notifications for this category disabled
  );
};

const getMembersData: GetDataFn<
  NotificationUserFragment,
  { colonyAddress: string }
> = async ({ colonyAddress }, nextToken) => {
  const response = await amplifyClient.query<
    GetColonyContributorsNotificationDataQuery,
    GetColonyContributorsNotificationDataQueryVariables
  >(GetColonyContributorsNotificationDataDocument, {
    colonyAddress,
    limit: 100,
    ...(nextToken ? { nextToken } : {}),
  });

  return response?.data?.getContributorsByColony;
};

// Get all the recipients of a colony wide notification in the format Magicbell expects.
export const getRecipientsOfColonyWideNotification = async (
  colonyAddress: string,
  noticationCategory: NotificationCategory,
): Promise<Recipient[]> => {
  const recipients: Recipient[] = [];

  const members = await getAllPagesOfData(getMembersData, { colonyAddress });

  members.forEach((member) => {
    if (!member?.user?.notificationsData) {
      return;
    }
    if (
      shouldSendNotificationToRecipient(
        member.user.notificationsData,
        colonyAddress,
        noticationCategory,
      )
    ) {
      recipients.push({
        external_id: member.user.notificationsData.magicbellUserId,
      });
    }
  });

  return recipients;
};

// Send a notification when an permissions action is made.
export const sendPermissionsActionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  mentions,
  notificationCategory,
}: PermissionsActionNotificationVariables): Promise<void> => {
  // Don't send notifications for permissions actions done by extensions. These will be motion finalizations.
  const isExtension = await isAddressExtension(creator);
  if (isExtension) {
    return;
  }

  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(
    colonyAddress,
    notificationCategory,
  );

  if (recipients.length > 0) {
    // Send the colony wide notifications.
    await sendNotification(
      `Permissions action created: ${transactionHash}`,
      recipients,
      {
        notificationType: NotificationType.PermissionsAction,
        notificationCategory,
        creator,
        colonyAddress,
        transactionHash,
      },
    );
  }

  // If any colony members should also recieve a specific "mention" notification...
  if (mentions?.length) {
    sendMentionNotifications({
      colonyAddress,
      creator,
      transactionHash,
      recipients: mentions,
    });
  }
};

// Send a notification when an expenditure is created / updated.
export const sendExpenditureUpdateNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  expenditureID,
  notificationType,
}: ExpenditureUpdateNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(
    colonyAddress,
    NotificationCategory.Payment,
  );

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(`Expenditure: ${expenditureID}`, recipients, {
    notificationType,
    notificationCategory: NotificationCategory.Payment,
    creator,
    colonyAddress,
    transactionHash,
    expenditureID,
  });
};

// Send a notification when a multisig action is created / updated.
export const sendMultisigActionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  notificationType,
  notificationCategory,
  expenditureID,
}: MultisigActionNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(
    colonyAddress,
    notificationCategory,
  );

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(`Multisig: ${transactionHash}`, recipients, {
    notificationType,
    notificationCategory,
    creator,
    colonyAddress,
    transactionHash,
    expenditureID,
  });
};

// Send a notification when a motion is created / updated.
export const sendMotionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  notificationType,
  notificationCategory,
  expenditureID,
}: MotionNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(
    colonyAddress,
    notificationCategory,
  );

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(`Motion: ${transactionHash}`, recipients, {
    notificationType,
    notificationCategory,
    creator,
    colonyAddress,
    transactionHash,
    expenditureID,
  });
};

// Send a notification when an extension is updated.
export const sendExtensionUpdateNotifications = async ({
  colonyAddress,
  transactionHash,
  creator,
  extensionHash,
  notificationType,
}: ExtensionUpdateNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(
    colonyAddress,
    NotificationCategory.Admin,
  );

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(`Extension: ${extensionHash}`, recipients, {
    notificationType,
    creator,
    notificationCategory: NotificationCategory.Admin,
    colonyAddress,
    transactionHash,
    extensionHash,
  });
};

// Send a notification when a user is mentioned.
export const sendMentionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  expenditureID,
  recipients,
}: MentionNotificationVariables): Promise<void> => {
  const recipientsExcludingCreator = recipients.filter(
    (recipient) => recipient !== creator,
  );

  if (!recipientsExcludingCreator.length) {
    return;
  }

  const response = await amplifyClient.query<
    GetNotificationUsersQuery,
    GetNotificationUsersQueryVariables
  >(GetNotificationUsersDocument, {
    filter: {
      or: recipientsExcludingCreator.map((address) => ({
        id: { eq: address },
      })),
    },
    limit: 9999,
  });

  const validRecipients: Recipient[] = [];

  (response?.data?.listUsers?.items ?? []).forEach((user: any) => {
    if (
      user?.notificationsData &&
      shouldSendNotificationToRecipient(
        user.notificationsData,
        colonyAddress,
        NotificationCategory.Mention,
      )
    ) {
      validRecipients.push({
        external_id: user.notificationsData.magicbellUserId,
      });
    }
  });

  if (validRecipients.length) {
    await sendNotification(`Mention: ${transactionHash}`, validRecipients, {
      notificationType: NotificationType.Mention,
      notificationCategory: NotificationCategory.Mention,
      creator,
      colonyAddress,
      transactionHash,
      expenditureID,
    });
  }
};

export const sendFundsClaimedNotifications = async ({
  creator,
  colonyAddress,
  tokenAddress,
  tokenAmount,
  tokenSymbol,
}: FundsClaimedNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(
    colonyAddress,
    NotificationCategory.Payment,
  );

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(
    `Incoming funds claimed: ${tokenAmount} ${tokenSymbol}`,
    recipients,
    {
      notificationType: NotificationType.FundsClaimed,
      notificationCategory: NotificationCategory.Payment,
      creator,
      colonyAddress,
      tokenAmount,
      tokenAddress,
    },
  );
};

export const sendColonyVersionAddedNotifications = async (
  newVersion: number,
): Promise<void> => {
  const allColonies = await getAllColoniesWithRootPermissionHolders();

  await Promise.all(
    allColonies.map(async (colony) => {
      const recipients: Recipient[] = [];

      if (!colony.roles?.items) {
        return;
      }

      for (const roleItem of colony.roles.items) {
        if (
          !!roleItem?.targetUser?.notificationsData &&
          shouldSendNotificationToRecipient(
            roleItem.targetUser.notificationsData,
            colony.id,
            NotificationCategory.Admin,
          )
        ) {
          recipients.push({
            external_id: roleItem.targetUser.notificationsData.magicbellUserId,
          });
        }
      }

      if (recipients.length > 0) {
        await sendNotification(
          `New colony version: ${newVersion}`,
          recipients,
          {
            notificationType: NotificationType.NewColonyVersion,
            notificationCategory: NotificationCategory.Admin,
            colonyAddress: colony.id,
            creator: colony.id, // who's the creator of this??
            newColonyVersion: newVersion.toString(),
          },
        );
      }
    }),
  );
};

export const sendExtensionVersionAddedNotifications = async ({
  newVersion,
  extensionHash,
}: ExtensionVersionAddedNotificationVariables): Promise<void> => {
  const allColonies = await getAllColoniesWithRootPermissionHolders();

  await Promise.all(
    allColonies.map(async (colony) => {
      const recipients: Recipient[] = [];

      if (!colony.roles?.items) {
        return;
      }

      for (const roleItem of colony.roles.items) {
        if (
          !!roleItem?.targetUser?.notificationsData &&
          shouldSendNotificationToRecipient(
            roleItem.targetUser.notificationsData,
            colony.id,
            NotificationCategory.Admin,
          )
        ) {
          recipients.push({
            external_id: roleItem.targetUser.notificationsData.magicbellUserId,
          });
        }
      }

      if (recipients.length > 0) {
        await sendNotification(
          `Extension ${extensionHash} new version: ${newVersion}`,
          recipients,
          {
            notificationType: NotificationType.NewExtensionVersion,
            notificationCategory: NotificationCategory.Admin,
            colonyAddress: colony.id,
            creator: colony.id,
            extensionHash,
            newExtensionVersion: newVersion.toString(),
          },
        );
      }
    }),
  );
};

export const sendNotification = async (
  title: string,
  recipients: Recipient[],
  customAttributes: NotificationVariables,
): Promise<void> => {
  // Notifications are turned off by default in development to save space in magicbell and avoid unnecessary notifications.
  // If you need notifications on in your local, restart your dev env and run `npm run dev --notifications` instead of just `npm run dev`.
  // Alternatively, you can of course run the block ingestor locally and uncomment this if statement, but you need to remember to set a random unique
  // value for MAGICBELL_DEV_KEY in the .env of both the block ingestor and the cdapp (must be the same in both) to ensure you only see notifications from your local.
  if (
    process.env.NODE_ENV === 'development' &&
    (process.env.MAGICBELL_DEV_KEY === 'OFF' || !process.env.MAGICBELL_DEV_KEY)
  ) {
    console.log(
      "A notification was triggered, but they are disabled in development. To turn them on see the 'sendNotification' function in src/utils/notifications.ts",
    );
    return;
  }
  try {
    await Notification.create({
      title,
      recipients,
      custom_attributes: {
        ...customAttributes,
      },
      ...(process.env.NODE_ENV === 'development'
        ? {
            topic: process.env.MAGICBELL_DEV_KEY,
          }
        : {}),
    });
  } catch (err) {
    console.log(`Unable to create notification "${title}": `, err);
  }
};

export const getNotificationCategory = (
  actionType: ColonyActionType | null | undefined,
): NotificationCategory | null => {
  let notificationCategory: NotificationCategory | null;

  switch (actionType) {
    case ColonyActionType.AddVerifiedMembers:
    case ColonyActionType.AddVerifiedMembersMotion:
    case ColonyActionType.AddVerifiedMembersMultisig:
    case ColonyActionType.ColonyEdit:
    case ColonyActionType.ColonyEditMotion:
    case ColonyActionType.ColonyEditMultisig:
    case ColonyActionType.CreateDecisionMotion:
    case ColonyActionType.CreateDecisionMultisig:
    case ColonyActionType.CreateDomain:
    case ColonyActionType.CreateDomainMotion:
    case ColonyActionType.CreateDomainMultisig:
    case ColonyActionType.EditDomain:
    case ColonyActionType.EditDomainMotion:
    case ColonyActionType.EditDomainMultisig:
    case ColonyActionType.EmitDomainReputationPenalty:
    case ColonyActionType.EmitDomainReputationPenaltyMotion:
    case ColonyActionType.EmitDomainReputationPenaltyMultisig:
    case ColonyActionType.EmitDomainReputationReward:
    case ColonyActionType.EmitDomainReputationRewardMotion:
    case ColonyActionType.EmitDomainReputationRewardMultisig:
    case ColonyActionType.Generic:
    case ColonyActionType.MakeArbitraryTransaction:
    case ColonyActionType.MakeArbitraryTransactionsMotion:
    case ColonyActionType.MakeArbitraryTransactionsMultisig:
    case ColonyActionType.Recovery:
    case ColonyActionType.RemoveVerifiedMembers:
    case ColonyActionType.RemoveVerifiedMembersMotion:
    case ColonyActionType.RemoveVerifiedMembersMultisig:
    case ColonyActionType.SetUserRoles:
    case ColonyActionType.SetUserRolesMotion:
    case ColonyActionType.SetUserRolesMultisig:
    case ColonyActionType.VersionUpgrade:
    case ColonyActionType.VersionUpgradeMotion:
    case ColonyActionType.VersionUpgradeMultisig:
    case ColonyActionType.WrongColony: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.CancelExpenditure:
    case ColonyActionType.CancelExpenditureMotion:
    case ColonyActionType.CancelStakedExpenditureMultisig:
    case ColonyActionType.CreateExpenditure:
    case ColonyActionType.EditExpenditure:
    case ColonyActionType.EditExpenditureMotion:
    case ColonyActionType.FinalizeExpenditure:
    case ColonyActionType.FinalizeExpenditureMotion:
    case ColonyActionType.FundExpenditureMotion:
    case ColonyActionType.FundExpenditureMultisig:
    case ColonyActionType.LockExpenditure:
    case ColonyActionType.ManageTokens:
    case ColonyActionType.ManageTokensMotion:
    case ColonyActionType.ManageTokensMultisig:
    case ColonyActionType.MintTokens:
    case ColonyActionType.MintTokensMotion:
    case ColonyActionType.MintTokensMultisig:
    case ColonyActionType.MoveFunds:
    case ColonyActionType.MoveFundsMotion:
    case ColonyActionType.MoveFundsMultisig:
    case ColonyActionType.MultiplePayment:
    case ColonyActionType.MultiplePaymentMotion:
    case ColonyActionType.MultiplePaymentMultisig:
    case ColonyActionType.Payment:
    case ColonyActionType.PaymentMotion:
    case ColonyActionType.PaymentMultisig:
    case ColonyActionType.SetExpenditureStateMotion:
    case ColonyActionType.SetExpenditureStateMultisig:
    case ColonyActionType.UnlockToken:
    case ColonyActionType.UnlockTokenMotion:
    case ColonyActionType.UnlockTokenMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.NullMotion:
    default: {
      notificationCategory = null;
      break;
    }
  }

  return notificationCategory;
};
