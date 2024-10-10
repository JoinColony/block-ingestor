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
import { isAddressExtension } from './extensions';

export enum NotificationCategory {
  Mention = 'Mention',
  Payment = 'Payment',
  Admin = 'Admin',
  Extension = 'Extension',
}

export enum NotificationType {
  // Expenditures
  ExpenditureReadyForReview = 'ExpenditureReadyForReview',
  ExpenditureReadyForFunding = 'ExpenditureReadyForFunding',
  ExpenditureReadyForRelease = 'ExpenditureReadyForRelease',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureCancelled = 'ExpenditureCancelled',

  // Funds
  FundsClaimed = 'FundsClaimed',

  // Mentions
  Mention = 'Mention',

  // Multisig
  MultiSigActionCreated = 'MultiSigActionCreated',
  MultiSigActionFinalized = 'MultiSigActionFinalized',
  MultiSigActionApproved = 'MultiSigActionApproved',
  MultiSigActionRejected = 'MultiSigActionRejected',

  // Actions made with permissions
  PermissionsAction = 'PermissionsAction',

  // Extensions
  ExtensionInstalled = 'ExtensionInstalled',
  ExtensionUpgraded = 'ExtensionUpgraded',
  ExtensionEnabled = 'ExtensionEnabled',
  ExtensionDeprecated = 'ExtensionDeprecated',
  ExtensionUninstalled = 'ExtensionUninstalled',
  ExtensionSettingsChanged = 'ExtensionSettingsChanged',
}

interface NotificationVariables {
  colonyAddress: string;
  creator: string;
  notificationType: NotificationType;
  notificationCategory: NotificationCategory;
  transactionHash?: string;
  expenditureID?: string;
  tokenAmount?: string;
  tokenAddress?: string;
  extensionHash?: string;
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

interface FundsClaimedNotificationVariables
  extends Pick<NotificationVariables, 'colonyAddress' | 'creator'> {
  tokenSymbol: string;
  tokenAmount: string;
  tokenAddress: string;
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

interface MultisigActionNotificationVariables
  extends Omit<NotificationVariables, 'notificationType'> {
  notificationType:
    | NotificationType.MultiSigActionCreated
    | NotificationType.MultiSigActionFinalized
    | NotificationType.MultiSigActionApproved
    | NotificationType.MultiSigActionRejected;
  }
  
interface ExtensionUpdateNotificationVariables
  extends Omit<
    NotificationVariables,
    'notificationType' | 'notificationCategory'
  > {
  extensionHash?: string;
  notificationType:
    | NotificationType.ExtensionInstalled
    | NotificationType.ExtensionUpgraded
    | NotificationType.ExtensionEnabled
    | NotificationType.ExtensionDeprecated
    | NotificationType.ExtensionUninstalled
    | NotificationType.ExtensionSettingsChanged;
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
  // Don't send notifications for permissions actions done by extensions. These will be motion finalizations.
  const isExtension = await isAddressExtension(creator);
  if (isExtension) {
    return;
  }

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

// Send a notification when an expenditure is created / updated.
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

// Send a notification when a multisig action is created / updated.
export const sendMultisigActionNotifications = async ({
  creator,
  colonyAddress,
  transactionHash,
  notificationType,
  notificationCategory,
}: MultisigActionNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

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
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

  if (!recipients.length) {
    return;
  }

  // Send the colony wide notifications.
  await sendNotification(`Extension: ${extensionHash}`, recipients, {
    notificationType,
    creator,
    notificationCategory: NotificationCategory.Extension,
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

export const sendFundsClaimedNotifications = async ({
  creator,
  colonyAddress,
  tokenAddress,
  tokenAmount,
  tokenSymbol,
}: FundsClaimedNotificationVariables): Promise<void> => {
  // Get the recipients of the colony wide notifications.
  const recipients = await getRecipientsOfColonyWideNotification(colonyAddress);

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
