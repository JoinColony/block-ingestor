import MagicBellClient, { Notification } from '@magicbell/core';
import { query } from '~amplifyClient';
import {
  GetColonyContributorsNotificationDataDocument,
  GetColonyContributorsNotificationDataQuery,
  GetColonyContributorsNotificationDataQueryVariables,
  NotificationsDataFragment,
} from '~graphql';

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

// Set up the notification client
export const setupNotificationsClient = async (): Promise<void> => {
  await MagicBellClient.createInstance({
    apiKey: process.env.MAGICBELL_API_KEY as string,
    apiSecret: process.env.MAGICBELL_API_SECRET as string,
  });
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

// Get all the recipients of a colony wide notification in the format Magicbell expects.
const getRecipientsOfColonyWideNotification = async (
  colonyAddress: string,
): Promise<Array<{ external_id: string }>> => {
  const recipients: Array<{ external_id: string }> = [];
  let nextToken: string | null | undefined;

  do {
    const members = await query<
      GetColonyContributorsNotificationDataQuery,
      GetColonyContributorsNotificationDataQueryVariables
    >(GetColonyContributorsNotificationDataDocument, {
      colonyAddress,
      limit: 100,
      ...(nextToken ? { nextToken } : {}),
    });

    if (members?.data?.getContributorsByColony) {
      members.data.getContributorsByColony.items.forEach((member) => {
        const notificationsData = member?.user?.notificationsData;

        if (!notificationsData) {
          return;
        }

        if (
          shouldSendNotificationToRecipient(notificationsData, colonyAddress)
        ) {
          recipients.push({
            external_id: notificationsData.magicbellUserId,
          });
        }
      });

      nextToken = members?.data?.getContributorsByColony?.nextToken;
    } else {
      nextToken = null;
    }
  } while (nextToken);

  return recipients;
};

// Send a notification when an action is made.
export const sendActionNotification = async ({
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
  await Notification.create({
    title,
    recipients,
    custom_attributes: {
      notificationType,
      creator,
      colonyAddress,
      transactionHash,
      ...(amount ? { amount } : {}),
      ...(tokenAddress ? { tokenAddress } : {}),
    },
  });

  // If any colony members should also recieve a specific "mention" notification...
  if (mentions) {
    // ...and they are valid (ie. have not muted notifications app wide or for this colony)...
    const mentionRecipients = recipients.filter((recipient) =>
      mentions.includes(recipient.external_id),
    );

    // send the mention notification to them.
    if (mentionRecipients) {
      await Notification.create({
        title: `${title} - Mention`,
        recipients: mentionRecipients,
        custom_attributes: {
          notificationType: NotificationType.Mention,
          creator,
          colonyAddress,
          transactionHash,
          ...(amount ? { amount } : {}),
          ...(tokenAddress ? { tokenAddress } : {}),
        },
      });
    }
  }
};
