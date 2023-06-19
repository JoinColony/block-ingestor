/**
 * In development, where both the chain and the DB gets reset everytime,
 * we need to "seed" some initial data, such as versions or the current network fee
 * In live environments, these values will already have been saved in the DB
 */

import { getExtensionHash, getLogs } from '@colony/colony-js';
import { mutate } from '~amplifyClient';
import {
  COLONY_CURRENT_VERSION_KEY,
  NETWORK_INVERSE_FEE_DATABASE_ID,
  SUPPORTED_EXTENSION_IDS,
} from '~constants';
import {
  CreateCurrentNetworkInverseFeeDocument,
  CreateCurrentNetworkInverseFeeMutation,
  CreateCurrentNetworkInverseFeeMutationVariables,
  SetCurrentVersionDocument,
  SetCurrentVersionMutation,
  SetCurrentVersionMutationVariables,
} from '~graphql';
import networkClient from '~networkClient';

import { mapLogToContractEvent } from './events';
import { writeExtensionVersionFromEvent } from './extensions';
import { toNumber } from './numbers';

const seedNetworkFee = async (): Promise<void> => {
  const networkInverseFee = await networkClient.getFeeInverse();
  const convertedFee = networkInverseFee.toString();

  await mutate<
    CreateCurrentNetworkInverseFeeMutation,
    CreateCurrentNetworkInverseFeeMutationVariables
  >(CreateCurrentNetworkInverseFeeDocument, {
    input: {
      id: NETWORK_INVERSE_FEE_DATABASE_ID,
      inverseFee: convertedFee,
    },
  });
};

const seedExtensionsVersions = async (): Promise<void> => {
  SUPPORTED_EXTENSION_IDS.forEach(async (extensionId) => {
    const extensionHash = getExtensionHash(extensionId);
    const extensionAddedToNetworkLogs = await getLogs(
      networkClient,
      networkClient.filters.ExtensionAddedToNetwork(extensionHash),
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
  });
};

const seedColoniesVersions = async (): Promise<void> => {
  const version = await networkClient.getCurrentColonyVersion();

  await mutate<SetCurrentVersionMutation, SetCurrentVersionMutationVariables>(
    SetCurrentVersionDocument,
    {
      input: {
        key: COLONY_CURRENT_VERSION_KEY,
        version: toNumber(version),
      },
    },
  );
};

export const seedDB = async (): Promise<void> => {
  await seedNetworkFee();
  await seedExtensionsVersions();
  await seedColoniesVersions();
};
