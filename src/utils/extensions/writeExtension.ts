import { constants, Contract } from 'ethers';
import { Log } from '@ethersproject/providers';
import { getLogs } from '@colony/colony-js';

import networkClient from '../../networkClient';
import { mutate } from '../../amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '../../types';
import { verbose } from '../logger';
import { toNumber } from '../numbers';

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
 * @param shouldUpsert If true, the function will call updateExtensionByColonyAndHash mutation
 * instead of createColonyExtension
 */
export const writeExtensionFromEvent = async (
  event: ContractEvent,
  extensionAddress: string,
  overrideVersion?: number,
  isDeprecated?: boolean,
  isInitialised?: boolean,
  shouldUpsert?: boolean,
): Promise<void> => {
  const { transactionHash, timestamp } = event;
  const { extensionId: extensionHash, colony, version } = event.args;
  const convertedVersion = toNumber(version);

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

  if (shouldUpsert) {
    await mutate('updateColonyExtensionByColonyAndHash', {
      input,
    });
  } else {
    await mutate('createColonyExtension', {
      input: {
        id: extensionAddress,
        ...input,
      },
    });
  }
};

export const deleteExtensionFromEvent = async (
  event: ContractEvent,
): Promise<void> => {
  const { extensionId: extensionHash, colony } = event.args;

  verbose('Extension:', extensionHash, 'uninstalled in Colony:', colony);

  await mutate('updateColonyExtensionByColonyAndHash', {
    input: {
      colonyId: colony,
      hash: extensionHash,
      isDeleted: true,
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
    {
      fromBlock: installedLog.blockNumber,
    },
  );
  const mostRecentDeprecatedLog =
    extensionDeprecatedLogs[extensionDeprecatedLogs.length - 1];

  // Short-circuit if there's no log or it happened before the installation
  if (
    !mostRecentDeprecatedLog ||
    mostRecentDeprecatedLog.blockNumber < installedLog.blockNumber
  ) {
    return false;
  }

  const parsedLog = await networkClient.interface.parseLog(
    mostRecentDeprecatedLog,
  );

  return !!parsedLog.args.deprecated;
};

export const isExtensionInitialised = async (
  extensionAddress: string,
  installedLog: Log,
): Promise<boolean> => {
  const extensionContract = new Contract(extensionAddress, [
    `event ${ContractEventsSignatures.ExtensionInitialised}`,
  ]);

  const extensionInitialisedLogs = await getLogs(
    networkClient,
    {
      topics: extensionContract.filters.ExtensionInitialised().topics,
      address: extensionAddress,
    },
    {
      fromBlock: installedLog.blockNumber,
    },
  );
  const mostRecentInitialisedLog =
    extensionInitialisedLogs[extensionInitialisedLogs.length - 1];

  return !!(
    mostRecentInitialisedLog &&
    mostRecentInitialisedLog.blockNumber >= installedLog.blockNumber
  );
};
