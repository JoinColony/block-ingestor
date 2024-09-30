import MagicBellClient, { Notification } from '@magicbell/core';
import { query } from '~amplifyClient';
import {
  GetColonyContributorsNotificationDataDocument,
  GetColonyContributorsNotificationDataQuery,
  GetColonyContributorsNotificationDataQueryVariables,
  NotificationsDataFragment,
  NotificationUserFragment,
} from '~graphql';
import { getAllPagesOfData, GetDataFn } from './graphql';

export enum NotificationType {
  Action = 'Action',
  Mention = 'Mention',
}

interface NotificationVariables {
  colonyAddress: string;
  creator: string;
  notificationType: NotificationType;
  transactionHash: string;
}

interface ActionNotificationVariables
  extends Omit<NotificationVariables, 'notificationType'> {
  mentions?: string[];
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
const getRecipientsOfColonyWideNotification = async (
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

// Send a notification when an action is made.
export const sendActionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  mentions,
}: ActionNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(`Action: ${transactionHash}`, recipients, {
    notificationType: NotificationType.Action,
    creator,
    colonyAddress,
    transactionHash,
  });

  // If any colony members should also recieve a specific "mention" notification...
  if (mentions) {
    // ...and they are valid (ie. have not muted notifications app wide or for this colony)...
    const mentionRecipients = recipients.filter((recipient) =>
      mentions.includes(recipient.external_id),
    );

    // send the mention notification to them.
    if (mentionRecipients.length) {
      await sendNotification(`Mention: ${transactionHash}`, mentionRecipients, {
        notificationType: NotificationType.Mention,
        creator,
        colonyAddress,
        transactionHash,
      });
    }
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
