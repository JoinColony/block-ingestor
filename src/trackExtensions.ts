import { Extension, getExtensionHash, getLogs } from '@colony/colony-js';
import { extensionSpecificEventsListener } from './eventListener';

import networkClient from './networkClient';
import { verbose } from './utils';

const supportedExtensionIds = [getExtensionHash(Extension.VotingReputation)];

export default async (): Promise<void> => {
  verbose('Fetching already installed extensions');

  supportedExtensionIds.forEach(async (extensionId) => {
    const extensionInstalledLogs = await getLogs(
      networkClient,
      networkClient.filters.ExtensionInstalled(extensionId),
    );
    const extensionUninstalledLogs = await getLogs(
      networkClient,
      networkClient.filters.ExtensionUninstalled(extensionId),
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

    /**
     * Only the colonies with installation count > 0 have this extension currently installed
     */
    for (const [colony, installationsCount] of Object.entries(
      installedInColonyCount,
    )) {
      if (installationsCount > 0) {
        const extensionAddress = await networkClient.getExtensionInstallation(
          extensionId,
          colony,
        );

        await extensionSpecificEventsListener(extensionAddress);
      }
    }
  });
};
