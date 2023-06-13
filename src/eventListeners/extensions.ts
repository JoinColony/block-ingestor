import { ClientType, Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { query } from '~amplifyClient';
import {
  ListUninitializedExtensionsDocument,
  ListUninitializedExtensionsQuery,
  ListUninitializedExtensionsQueryVariables,
} from '~graphql';
import { notNull, output } from '~utils';
import { addEventListener } from '~eventListeners';

import { addNetworkEventListener } from './network';

const fetchExtensionsAddresses = async (
  extensionHash: string,
): Promise<string[]> => {
  const extensions = [];
  let nextToken: string | undefined;

  do {
    const { data } =
      (await query<
        ListUninitializedExtensionsQuery,
        ListUninitializedExtensionsQueryVariables
      >(ListUninitializedExtensionsDocument, {
        nextToken,
        hash: extensionHash,
      })) ?? {};

    const { items } = data?.getExtensionsByHash ?? {};
    extensions.push(...(items ?? []));

    nextToken = data?.getExtensionsByHash?.nextToken ?? '';
  } while (nextToken);

  return extensions.filter(notNull).map((extension) => extension.id);
};

export const setupListenersForExtensions = async (): Promise<void> => {
  const extensionEvents = [
    ContractEventsSignatures.ExtensionInstalled,
    ContractEventsSignatures.ExtensionUninstalled,
    ContractEventsSignatures.ExtensionDeprecated,
    ContractEventsSignatures.ExtensionUpgraded,
  ];

  extensionEvents.forEach((eventSignature) =>
    addNetworkEventListener(eventSignature),
  );

  output(`Setting up listeners for VotingReputation extensions`);
  const extensionHash = getExtensionHash(Extension.VotingReputation);
  const addresses = await fetchExtensionsAddresses(extensionHash);
  addresses.forEach((extensionAddress) =>
    setupListenersForExtension(extensionAddress, extensionHash),
  );
};

/**
 * Function setting up listeners for an extension with a given address and hash
 * Currently it only supports VotingReputation extension
 * NOTE: If we ever want to extend it to other extensions, we'll most likely
 * need a mapping between extension hashes and the corresponding client types
 */
export const setupListenersForExtension = (
  extensionAddress: string,
  extensionHash: string,
): void => {
  if (extensionHash === getExtensionHash(Extension.VotingReputation)) {
    addEventListener({
      eventSignature: ContractEventsSignatures.ExtensionInitialised,
      address: extensionAddress,
      clientType: ClientType.VotingReputationClient,
    });
  }
};
