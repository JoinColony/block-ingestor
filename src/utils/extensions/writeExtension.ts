import { constants } from 'ethers';
import { Log } from '@ethersproject/providers';
import { Extension, getExtensionHash, getLogs } from '@colony/colony-js';

import networkClient from '~networkClient';
import { mutate } from '~amplifyClient';
import { ContractEvent, VotingReputationConfig } from '~types';
import { verbose, toNumber } from '~utils';

import { getExtensionContract } from './contracts';

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

  const input: Record<string, any> = {
    colonyId: colony,
    hash: extensionHash,
    version: overrideVersion ?? convertedVersion,
    installedBy,
    installedAt: timestamp,
    isDeprecated: !!isDeprecated,
    isDeleted: false,
    isInitialized: !!isInitialised,
    extensionConfig: null,
  };

  /** If Voting Reputation is initialised, add its config to the db. */
  if (
    extensionHash === getExtensionHash(Extension.VotingReputation) &&
    isInitialised
  ) {
    input.extensionConfig = await getExtensionConfig(
      Extension.VotingReputation,
      colony,
    );
  }

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
  const extensionContract = getExtensionContract(extensionAddress);

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

const getExtensionConfig = async (
  extensionId: Extension,
  colonyAddress: string,
): Promise<VotingReputationConfig | null> => {
  switch (extensionId) {
    case Extension.VotingReputation: {
      const colonyClient = await networkClient.getColonyClient(colonyAddress);
      const votingReputationClient = await colonyClient.getExtensionClient(
        Extension.VotingReputation,
      );

      const userMinStakeFraction =
        await votingReputationClient.getUserMinStakeFraction();
      const totalStakeFraction =
        await votingReputationClient.getTotalStakeFraction();

      return {
        minimumStake: userMinStakeFraction.toString(),
        requiredStake: totalStakeFraction.toString(),
      };
    }

    default: {
      return null;
    }
  }
};

export const writeVotingReputationInitParamsToDB = async (
  extensionAddress: string,
  colonyAddress: string,
): Promise<void> => {
  const extensionConfig = await getExtensionConfig(
    Extension.VotingReputation,
    colonyAddress,
  );
  await mutate('updateColonyExtensionByAddress', {
    input: {
      id: extensionAddress,
      extensionConfig,
    },
  });
};
