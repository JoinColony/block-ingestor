import { Extension, getExtensionHash, getLogs } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { extensionSpecificEventsListener } from './eventListener';
import networkClient from './networkClient';
import {
  isExtensionDeprecated,
  mapLogToContractEvent,
  verbose,
  writeExtensionFromEvent,
} from './utils';
import { SUPPORTED_EXTENSION_IDS } from './constants';

export default async (): Promise<void> => {
  verbose('Fetching existing extensions');

  SUPPORTED_EXTENSION_IDS.forEach(async (extensionId) => {
    trackExtensionInstallations(extensionId);
  });
};

const trackExtensionInstallations = async (
  extensionId: Extension,
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
      installedInColonyCount[colony]++;
    } else {
      installedInColonyCount[colony] = 1;
    }
  });
  extensionUninstalledLogs.forEach((log) => {
    const parsedLog = networkClient.interface.parseLog(log);
    const { colony } = parsedLog.args;

    if (colony in installedInColonyCount) {
      installedInColonyCount[colony]--;
    }
  });

  for (const [colony, installationsCount] of Object.entries(
    installedInColonyCount,
  )) {
    /**
     * Only the colonies with installation count > 0 have this extension currently installed
     */
    if (installationsCount === 0) {
      continue;
    }

    const extensionAddress = await networkClient.getExtensionInstallation(
      extensionHash,
      colony,
    );

    // Listen to extension specific events (e.g. ExtensionInitialised)
    await extensionSpecificEventsListener(extensionAddress, extensionHash);

    // Store the most recent installation in the db
    const lastInstalledLog =
      extensionInstalledLogs[extensionInstalledLogs.length - 1];
    const event = await mapLogToContractEvent(
      lastInstalledLog,
      networkClient.interface,
    );

    if (event) {
      /**
       * Get the currently installed version of extension
       * (so we don't have to worry about ExtensionUpgraded events)
       */
      const version = await (
        await (
          await networkClient.getColonyClient(colony)
        ).getExtensionClient(extensionId)
      ).version();
      const convertedVersion = BigNumber.from(version).toNumber();

      const isDeprecated = await isExtensionDeprecated(
        extensionHash,
        colony,
        lastInstalledLog,
      );

      await writeExtensionFromEvent(
        event,
        extensionAddress,
        convertedVersion,
        isDeprecated,
      );
    }
  }
};
