import { Extension, getExtensionHash, getLogs } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { Log } from '@ethersproject/providers';

import networkClient from '~networkClient';
import {
  deleteExtensionFromEvent,
  getCachedColonyClient,
  getLatestBlock,
  isExtensionDeprecated,
  isExtensionInitialised,
  mapLogToContractEvent,
  toNumber,
  verbose,
  writeExtensionFromEvent,
  writeExtensionVersionFromEvent,
} from '~utils';
import { SUPPORTED_EXTENSION_IDS } from '~constants';
import { extensionSpecificEventsListener } from '~eventListener';

export default async (): Promise<void> => {
  const latestBlock = getLatestBlock();

  const trackingPromises = SUPPORTED_EXTENSION_IDS.map(
    (extensionId) => async () => {
      verbose(
        `Fetching current version of extension: ${extensionId} starting from block: ${latestBlock}`,
      );

      await trackExtensionAddedToNetwork(extensionId, latestBlock);

      verbose(`Fetching events for extension: ${extensionId}`);
      await trackExtensionEvents(extensionId, latestBlock);
    },
  );

  for (const trackingPromise of trackingPromises) {
    await trackingPromise();
  }
};

const trackExtensionAddedToNetwork = async (
  extensionId: string,
  latestBlock: number,
): Promise<void> => {
  const extensionHash = getExtensionHash(extensionId);
  const extensionAddedToNetworkLogs = await getLogs(
    networkClient,
    networkClient.filters.ExtensionAddedToNetwork(extensionHash),
    { fromBlock: latestBlock },
  );

  // Only interested in the most recent one which contains the newest version
  const mostRecentLog =
    extensionAddedToNetworkLogs[extensionAddedToNetworkLogs.length - 1];
  if (!mostRecentLog) {
    return;
  }

  const event = await mapLogToContractEvent(
    mostRecentLog,
    networkClient.interface,
  );
  if (!event) {
    return;
  }

  writeExtensionVersionFromEvent(event);
};

const trackExtensionEvents = async (
  extensionId: Extension,
  latestBlock: number,
): Promise<void> => {
  const extensionHash = getExtensionHash(extensionId);
  const extensionInstalledLogs = await getLogs(
    networkClient,
    networkClient.filters.ExtensionInstalled(extensionHash),
  );
  const extensionUninstalledLogs = await getLogs(
    networkClient,
    networkClient.filters.ExtensionUninstalled(extensionHash),
  );

  /**
   * Looping through the logs to create a mapping between colonies
   * and the number of extension installations we encounter, minus uninstallations
   */
  const installedInColonyCount: { [address: string]: number } = {};
  extensionInstalledLogs.forEach((log) => {
    const parsedLog = networkClient.interface.parseLog(log);
    const { colony } = parsedLog.args;

    if (colony in installedInColonyCount) {
      installedInColonyCount[colony] += 1;
    } else {
      installedInColonyCount[colony] = 1;
    }
  });
  extensionUninstalledLogs.forEach((log) => {
    const parsedLog = networkClient.interface.parseLog(log);
    const { colony } = parsedLog.args;

    if (colony in installedInColonyCount) {
      installedInColonyCount[colony] -= 1;
    }
  });

  for (const [colony, installationsCount] of Object.entries(
    installedInColonyCount,
  )) {
    /**
     * If installation count is 0, that means the extension has been uninstalled
     */
    if (installationsCount <= 0) {
      const mostRecentUninstalledLog = getMostRecentLog(
        extensionUninstalledLogs,
        colony,
      );
      /**
       * Short circuit if there's no log or it happened before the latest processed block
       * (meaning it's already reflected in the db)
       */
      if (
        !mostRecentUninstalledLog ||
        mostRecentUninstalledLog.blockNumber < latestBlock
      ) {
        return;
      }

      const event = await mapLogToContractEvent(
        mostRecentUninstalledLog,
        networkClient.interface,
      );
      if (!event) {
        return;
      }

      await deleteExtensionFromEvent(event);

      return;
    }

    // Otherwise, the extension is currently installed
    const extensionAddress = await networkClient.getExtensionInstallation(
      extensionHash,
      colony,
    );

    // Listen to extension specific events (e.g. ExtensionInitialised)
    await extensionSpecificEventsListener(extensionAddress, extensionHash);

    // Store the most recent installation in the db
    const mostRecentInstalledLog = getMostRecentLog(
      extensionInstalledLogs,
      colony,
    );
    if (!mostRecentInstalledLog) {
      return;
    }

    const event = await mapLogToContractEvent(
      mostRecentInstalledLog,
      networkClient.interface,
    );
    if (!event) {
      return;
    }

    /**
     * Get the currently installed version of extension
     * (so we don't have to worry about ExtensionUpgraded events)
     */
    let version = BigNumber.from(1);
    try {
      version = await (
        await (
          await getCachedColonyClient(colony)
        ).getExtensionClient(extensionId)
      ).version();
    } catch (error) {}
    const convertedVersion = toNumber(version);

    const isDeprecated = await isExtensionDeprecated(
      extensionHash,
      colony,
      mostRecentInstalledLog,
    );

    const isInitialised = await isExtensionInitialised(
      extensionAddress,
      mostRecentInstalledLog,
    );

    await writeExtensionFromEvent(
      event,
      extensionAddress,
      convertedVersion,
      isDeprecated,
      isInitialised,
      true,
    );
  }
};

// Util returning the most recent extension installed/uninstalled log for a given colony address
const getMostRecentLog = (
  logs: Log[],
  colonyAddress: string,
): Log | undefined => {
  const colonyFilteredLogs = logs.filter(
    (log) =>
      networkClient.interface.parseLog(log).args.colony === colonyAddress,
  );
  return colonyFilteredLogs[colonyFilteredLogs.length - 1];
};
