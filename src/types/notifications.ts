import { NotificationType } from '~graphql';

export enum NotificationCategory {
  Mention = 'Mention',
  Payment = 'Payment',
  Admin = 'Admin',
}

export interface NotificationVariables {
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

export interface MentionNotificationVariables
  extends Omit<
    NotificationVariables,
    'notificationType' | 'notificationCategory'
  > {
  recipients: string[];
}

export interface PermissionsActionNotificationVariables
  extends Omit<NotificationVariables, 'notificationType'> {
  mentions?: string[];
}

export interface ExpenditureUpdateNotificationVariables
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

export interface MultisigActionNotificationVariables
  extends Omit<NotificationVariables, 'notificationType'> {
  notificationType:
    | NotificationType.MultisigActionCreated
    | NotificationType.MultisigActionFinalized
    | NotificationType.MultisigActionApproved
    | NotificationType.MultisigActionRejected;
}

export interface MotionNotificationVariables
  extends Omit<NotificationVariables, 'notificationType'> {
  notificationType:
    | NotificationType.MotionCreated
    | NotificationType.MotionOpposed
    | NotificationType.MotionSupported
    | NotificationType.MotionVoting
    | NotificationType.MotionReveal
    | NotificationType.MotionFinalized;
}

export interface FundsClaimedNotificationVariables
  extends Pick<NotificationVariables, 'colonyAddress' | 'creator'> {
  tokenSymbol: string;
  tokenAmount: string;
  tokenAddress: string;
}

export interface ExtensionUpdateNotificationVariables
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

export interface Recipient {
  external_id: string;
}
