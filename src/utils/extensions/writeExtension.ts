import { constants } from 'ethers';

import networkClient from '~networkClient';
import { mutate } from '~amplifyClient';
import { ContractEvent } from '~types';
import { verbose, toNumber } from '~utils';
import {
  CreateColonyExtensionDocument,
  CreateColonyExtensionMutation,
  CreateColonyExtensionMutationVariables,
  SetCurrentVersionDocument,
  SetCurrentVersionMutation,
  SetCurrentVersionMutationVariables,
  UpdateColonyExtensionByColonyAndHashDocument,
  UpdateColonyExtensionByColonyAndHashMutation,
  UpdateColonyExtensionByColonyAndHashMutationVariables,
} from '~graphql';

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

  await mutate<SetCurrentVersionMutation, SetCurrentVersionMutationVariables>(
    SetCurrentVersionDocument,
    {
      input: {
        key: extensionHash,
        version: convertedVersion,
      },
    },
  );
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
    await mutate<
      UpdateColonyExtensionByColonyAndHashMutation,
      UpdateColonyExtensionByColonyAndHashMutationVariables
    >(UpdateColonyExtensionByColonyAndHashDocument, {
      input,
    });
  } else {
    await mutate<
      CreateColonyExtensionMutation,
      CreateColonyExtensionMutationVariables
    >(CreateColonyExtensionDocument, {
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

  await mutate<
    UpdateColonyExtensionByColonyAndHashMutation,
    UpdateColonyExtensionByColonyAndHashMutationVariables
  >(UpdateColonyExtensionByColonyAndHashDocument, {
    input: {
      colonyId: colony,
      hash: extensionHash,
      isDeleted: true,
    },
  });
};
