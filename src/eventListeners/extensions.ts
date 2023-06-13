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
  addNetworkEventListener(ContractEventsSignatures.ExtensionInstalled);
  addNetworkEventListener(ContractEventsSignatures.ExtensionUninstalled);
  addNetworkEventListener(ContractEventsSignatures.ExtensionDeprecated);
  addNetworkEventListener(ContractEventsSignatures.ExtensionUpgraded);

  output(`Setting up listeners for VotingReputation extensions`);
  const extensionHash = getExtensionHash(Extension.VotingReputation);
  const addresses = await fetchExtensionsAddresses(extensionHash);
  addresses.forEach((extensionAddress) => {
    addEventListener({
      eventSignature: ContractEventsSignatures.ExtensionInitialised,
      address: extensionAddress,
      clientType: ClientType.VotingReputationClient,
    });
  });
};
