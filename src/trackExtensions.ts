import { Extension, getExtensionHash, getLogs } from '@colony/colony-js';
import { BigNumber, constants } from 'ethers';
import { Log } from '@ethersproject/providers';

import { mutate } from './amplifyClient';
import { extensionSpecificEventsListener } from './eventListener';
import networkClient from './networkClient';
import { verbose } from './utils';

/**
 * Defines extensions for which we want to track ExtensionInitialised events
 * Note: If an extension config in CDapp doesn't specify initialization params,
 * it is considered enabled straight after installation and we don't need
 * to track ExtensionInitialised events for it (e.g. OneTxPayment)
 */
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
    // Store the most recent extension installed parsed log (needed below)
    let lastInstalledLog: Log | undefined;

    /**
     * Looping through the logs to create a mapping between colonies
     * and the number of extension installations we encounter, minus uninstallations
     */
    const installedInColonyCount: { [address: string]: number } = {};
    extensionInstalledLogs.forEach((log) => {
      lastInstalledLog = log;
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

        if (lastInstalledLog) {
          const parsedLog = networkClient.interface.parseLog(lastInstalledLog);
          const { transactionHash } = lastInstalledLog;
          const { version } = parsedLog.args;
          const convertedVersion = BigNumber.from(version).toNumber();

          const receipt = await networkClient.provider.getTransactionReceipt(
            transactionHash,
          );
          const installedBy = receipt.from || constants.AddressZero;

          const timestamp = Math.floor(new Date().getTime() / 1000);

          mutate('createColonyExtension', {
            input: {
              id: extensionAddress,
              colonyId: colony,
              hash: extensionId,
              version: convertedVersion,
              installedBy,
              installedAt: timestamp,
              isDeprecated: false,
              isDeleted: false,
              isInitialized: false,
            },
          });
        }
      }
    }
  });
};
