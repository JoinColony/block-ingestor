import { constants } from 'ethers';

import { mutate, query } from '~amplifyClient';
import { ContractEvent } from '~types';
import { verbose, toNumber } from '~utils';
import {
  CreateColonyExtensionDocument,
  CreateColonyExtensionMutation,
  CreateColonyExtensionMutationVariables,
  GetColonyExtensionQuery,
  GetColonyExtensionQueryVariables,
  GetColonyExtensionDocument,
  GetColonyExtensionByHashAndColonyDocument,
  GetColonyExtensionByHashAndColonyQuery,
  GetColonyExtensionByHashAndColonyQueryVariables,
  CreateColonyExtensionInput,
  NotificationType,
} from '~graphql';
import { updateCurrentVersion } from '~utils/currentVersion';
import {
  sendExtensionUpdateNotifications,
  sendExtensionVersionAddedNotifications,
} from '~utils/notifications';
import { updateExtension } from './updateExtension';
import { Extension, getExtensionHash } from '@colony/colony-js';
import { getTransactionSignerAddress } from '~utils/transactions';
import provider from '~provider';

const EXTENSION_SUPPORTING_NOTIFICATIONS = [
  Extension.OneTxPayment,
  Extension.VotingReputation,
  Extension.StagedExpenditure,
  Extension.StakedExpenditure,
  Extension.StreamingPayments,
  Extension.MultisigPermissions,
];
/**
 * Function writing the extension version to the db based on the ExtensionAddedToNetwork event payload
 */
export const writeExtensionVersionFromEvent = async (
  event: ContractEvent,
): Promise<void> => {
  const { version, extensionId: extensionHash } = event.args;
  const convertedVersion = toNumber(version);

  verbose(
    'Extension:',
    extensionHash,
    `(version ${convertedVersion})`,
    'added to network',
  );

  const handleVersionUpdated = async (): Promise<void> => {
    // only send a notification if it's a supported extension
    if (
      EXTENSION_SUPPORTING_NOTIFICATIONS.some(
        (extension) => extensionHash === getExtensionHash(extension),
      )
    ) {
      await sendExtensionVersionAddedNotifications({
        extensionHash,
        newVersion: convertedVersion,
      });
    }
  };

  await updateCurrentVersion(
    extensionHash,
    convertedVersion,
    handleVersionUpdated,
  );
};

/**
 * Function extracting installed extension details from the event and writing it to the database
 * @param overrideVersion If set, it will be used instead of the version in the event arguments
 */
export const writeExtensionFromEvent = async (
  event: ContractEvent,
  extensionAddress: string,
  overrideVersion?: number,
  isDeprecated?: boolean,
  isInitialised?: boolean,
): Promise<void> => {
  const { transactionHash, timestamp } = event;
  const { extensionId: extensionHash, colony, version } = event.args;
  const convertedVersion = toNumber(version);

  const transaction = await provider.getTransaction(transactionHash);

  const installedBy =
    getTransactionSignerAddress(transaction) ?? constants.AddressZero;

  verbose(
    'Extension:',
    extensionHash,
    `(version ${convertedVersion})`,
    'installed in Colony:',
    colony,
  );

  const input = {
    colonyId: colony,
    hash: extensionHash,
    version: overrideVersion ?? convertedVersion,
    installedBy,
    installedAt: timestamp,
    isDeprecated: !!isDeprecated,
    isDeleted: false,
    isInitialized: !!isInitialised,
  };

  await createOrUpdateColonyExtension(input, extensionAddress);
};

export const deleteExtensionFromEvent = async (
  event: ContractEvent,
): Promise<void> => {
  const { extensionId: extensionHash, colony } = event.args;

  verbose('Extension:', extensionHash, 'uninstalled in Colony:', colony);

  const { data } =
    (await query<
      GetColonyExtensionByHashAndColonyQuery,
      GetColonyExtensionByHashAndColonyQueryVariables
    >(GetColonyExtensionByHashAndColonyDocument, {
      extensionHash,
      colonyAddress: colony,
    })) ?? {};

  const extensionId = data?.getExtensionByColonyAndHash?.items[0]?.id;

  if (extensionId) {
    await updateExtension(extensionId, {
      isDeleted: true,
    });
  }
};

const createOrUpdateColonyExtension = async (
  input: CreateColonyExtensionInput,
  extensionAddress: string,
): Promise<void> => {
  const { isDeprecated, isDeleted, isInitialized, version } = input;

  const { data } =
    (await query<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>(
      GetColonyExtensionDocument,
      {
        id: extensionAddress,
      },
    )) ?? {};

  const extension = data?.getColonyExtension?.colonyId;

  // If extension record doesn't exist, try to create one
  if (!extension) {
    sendExtensionUpdateNotifications({
      colonyAddress: input.colonyId,
      creator: input.installedBy,
      notificationType: NotificationType.ExtensionInstalled,
      extensionHash: input.hash,
    });

    await mutate<
      CreateColonyExtensionMutation,
      CreateColonyExtensionMutationVariables
    >(CreateColonyExtensionDocument, {
      input: {
        ...input,
        id: extensionAddress,
      },
    });
  } else {
    // Otherwise, update the existing extension

    sendExtensionUpdateNotifications({
      colonyAddress: input.colonyId,
      creator: input.installedBy,
      notificationType: NotificationType.ExtensionUpgraded,
      extensionHash: input.hash,
    });

    await updateExtension(extensionAddress, {
      isDeprecated,
      isDeleted,
      isInitialized,
      version,
    });
  }
};
