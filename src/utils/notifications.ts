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
  SimplePayment = 'SimplePayment',
  Mention = 'Mention',
}

interface NotificationVariables {
  title: string;
  creator: string;
  colonyAddress: string;
  transactionHash: string;
  notificationType: NotificationType;
  amount?: string;
  tokenAddress?: string;
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
  title,
  creator,
  colonyAddress,
  transactionHash,
  notificationType,
  amount,
  tokenAddress,
  mentions,
}: NotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(title, recipients, {
    notificationType,
    creator,
    colonyAddress,
    transactionHash,
    ...(amount ? { amount } : {}),
    ...(tokenAddress ? { tokenAddress } : {}),
  });

  // If any colony members should also recieve a specific "mention" notification...
  if (mentions) {
    // ...and they are valid (ie. have not muted notifications app wide or for this colony)...
    const mentionRecipients = recipients.filter((recipient) =>
      mentions.includes(recipient.external_id),
    );

    // send the mention notification to them.
    if (mentionRecipients) {
      await sendNotification(`${title} - Mention`, mentionRecipients, {
        notificationType: NotificationType.Mention,
        creator,
        colonyAddress,
        transactionHash,
        ...(amount ? { amount } : {}),
        ...(tokenAddress ? { tokenAddress } : {}),
      });
    }
  }
};

export const sendNotification = async (
  title: string,
  recipients: Recipient[],
  customAttributes: Record<string, string>,
): Promise<void> => {
  try {
    await Notification.create({
      title,
      recipients,
      custom_attributes: customAttributes,
    });
  } catch (err) {
    console.log(`Unable to create notification "${title}": `, err);
  }
};
