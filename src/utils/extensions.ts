import { BigNumber, constants } from 'ethers';
import { Log } from '@ethersproject/providers';
import { getLogs } from '@colony/colony-js';

import networkClient from '../networkClient';
import { mutate } from '../amplifyClient';
import { ContractEvent } from '../types';
import { verbose } from './logger';

/**
 * Function writing the extension version to the db based on the ExtensionAddedToNetwork event payload
 */
export const writeExtensionVersionFromEvent = async (
  event: ContractEvent,
): Promise<void> => {
  const { version, extensionId: extensionHash } = event.args;
  const convertedVersion = BigNumber.from(version).toNumber();

  verbose(
    'Extension:',
    extensionHash,
    `(version ${convertedVersion})`,
    'added to network',
  );

  await mutate('setCurrentVersion', {
    input: {
      key: extensionHash,
      version: convertedVersion,
    },
  });
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
): Promise<void> => {
  const { transactionHash, timestamp } = event;
  const { extensionId: extensionHash, colony, version } = event.args;
  const convertedVersion = BigNumber.from(version).toNumber();

  const receipt = await networkClient.provider.getTransactionReceipt(
    transactionHash,
  );
  const installedBy = receipt.from || constants.AddressZero;

  verbose(
    'Extension:',
    extensionHash,
    `(version ${convertedVersion})`,
    'installed in Colony:',
    colony,
  );

  await mutate('createColonyExtension', {
    input: {
      id: extensionAddress,
      colonyId: colony,
      hash: extensionHash,
      version: overrideVersion ?? convertedVersion,
      installedBy,
      installedAt: timestamp,
      isDeprecated: !!isDeprecated,
      isDeleted: false,
      isInitialized: false,
    },
  });
};

/**
 * Function determining whether an extension has been deprecated in colony
 * since its installation, based on the ExtensionInstalled event log
 */
export const isExtensionDeprecated = async (
  extensionHash: string,
  colonyAddress: string,
  installedLog: Log,
): Promise<boolean> => {
  const extensionDeprecatedLogs = await getLogs(
    networkClient,
    networkClient.filters.ExtensionDeprecated(extensionHash, colonyAddress),
  );
  const lastDeprecatedLog =
    extensionDeprecatedLogs[extensionDeprecatedLogs.length - 1];

  // Short-circuit if there's no log or it happened before the installation
  if (
    !lastDeprecatedLog ||
    lastDeprecatedLog.blockNumber < installedLog.blockNumber
  ) {
    return false;
  }

  const parsedLog = await networkClient.interface.parseLog(lastDeprecatedLog);

  return !!parsedLog.args.deprecated;
};
