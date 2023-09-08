import { constants } from 'ethers';

import networkClient from '~networkClient';
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
  SetCurrentVersionDocument,
  SetCurrentVersionMutation,
  SetCurrentVersionMutationVariables,
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
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

  await createOrUpdateColonyExtension(input, extensionAddress);
};

export const deleteExtensionFromEvent = async (
  event: ContractEvent,
): Promise<void> => {
  const {
    extensionId: extensionHash,
    colony,
    contractAddress: extensionAddress,
  } = event.args;

  verbose('Extension:', extensionHash, 'uninstalled in Colony:', colony);

  await mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      isDeleted: true,
    },
  });
};

const createOrUpdateColonyExtension = async (
  input: CreateColonyExtensionMutationVariables['input'],
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
    await mutate<
      CreateColonyExtensionMutation,
      CreateColonyExtensionMutationVariables
    >(CreateColonyExtensionDocument, {
      input,
    });
  } else {
    // Otherwise, update the exising extension
    await mutate<
      UpdateColonyExtensionByAddressMutation,
      UpdateColonyExtensionByAddressMutationVariables
    >(UpdateColonyExtensionByAddressDocument, {
      input: {
        id: extensionAddress,
        isDeprecated,
        isDeleted,
        isInitialized,
        version,
      },
    });
  }
};
