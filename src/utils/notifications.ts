import MagicBellClient, { Notification } from '@magicbell/core';
import { query } from '~amplifyClient';
import {
  GetColonyContributorsNotificationDataDocument,
  GetColonyContributorsNotificationDataQuery,
  GetColonyContributorsNotificationDataQueryVariables,
  GetNotificationUsersDocument,
  GetNotificationUsersQuery,
  GetNotificationUsersQueryVariables,
  NotificationsDataFragment,
  NotificationUserFragment,
} from '~graphql';
import { getAllPagesOfData, GetDataFn } from './graphql';

export enum NotificationCategory {
  Mention = 'Mention',
  Payment = 'Payment',
  Admin = 'Admin',
}

export enum NotificationType {
  ExpenditureReadyForReview = 'ExpenditureReadyForReview',
  ExpenditureReadyForFunding = 'ExpenditureReadyForFunding',
  ExpenditureReadyForRelease = 'ExpenditureReadyForRelease',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureCancelled = 'ExpenditureCancelled',
  PermissionsAction = 'PermissionsAction',
  Mention = 'Mention',
}

interface NotificationVariables {
  colonyAddress: string;
  creator: string;
  notificationType: NotificationType;
  notificationCategory: NotificationCategory;
  transactionHash?: string;
  expenditureID?: string;
}

interface MentionNotificationVariables
  extends Omit<
    NotificationVariables,
    'notificationType' | 'notificationCategory'
  > {
  recipients: string[];
}

interface PermissionsActionNotificationVariables
  extends Omit<NotificationVariables, 'notificationType'> {
  mentions?: string[];
}

interface ExpenditureUpdateNotificationVariables
  extends Omit<
    NotificationVariables,
    'notificationType' | 'notificationCategory' | 'expenditureID'
  > {
  expenditureID: string;
  notificationType:
    | NotificationType.ExpenditureReadyForReview
    | NotificationType.ExpenditureReadyForFunding
    | NotificationType.ExpenditureReadyForRelease
    | NotificationType.ExpenditureFinalized
    | NotificationType.ExpenditureCancelled;
}

interface Recipient {
  external_id: string;
}

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
): boolean => {
  return (
    !!notificationsData.magicbellUserId && // User has a magicbell user account made
    !notificationsData.notificationsDisabled && // User has not disabled notifications app-wide
    !notificationsData.mutedColonyAddresses.includes(colonyAddress) // User has not muted the colony that the notification is in
  );
};

const getMembersData: GetDataFn<
  NotificationUserFragment,
  { colonyAddress: string }
> = async ({ colonyAddress }, nextToken) => {
  const response = await query<
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
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

  if (!recipients.length) {
    return;
  }

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

// Send a notification when an expenditure is updated.
export const sendExpenditureUpdateNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  expenditureID,
  notificationType,
}: ExpenditureUpdateNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

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

// Send a notification when a user is mentioned.
export const sendMentionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  expenditureID,
  recipients,
}: MentionNotificationVariables): Promise<void> => {
  if (!recipients.length) {
    return;
  }

  const response = await query<
    GetNotificationUsersQuery,
    GetNotificationUsersQueryVariables
  >(GetNotificationUsersDocument, {
    filter: {
      or: recipients.map((address) => ({ id: { eq: address } })),
    },
    limit: 9999,
  });

  const validRecipients: Recipient[] = [];

  (response?.data?.listUsers?.items ?? []).forEach((user) => {
    if (
      user?.notificationsData &&
      shouldSendNotificationToRecipient(user.notificationsData, colonyAddress)
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

export const sendNotification = async (
  title: string,
  recipients: Recipient[],
  customAttributes: NotificationVariables,
): Promise<void> => {
  try {
    await Notification.create({
      title,
      recipients,
      custom_attributes: {
        ...customAttributes,
      },
      ...(process.env.NODE_ENV === 'development'
        ? {
            category: process.env.MAGICBELL_DEV_KEY,
          }
        : {}),
    });
  } catch (err) {
    console.log(`Unable to create notification "${title}": `, err);
  }
};
