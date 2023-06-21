import { ClientType, Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { query } from '~amplifyClient';
import {
  ExtensionFragment,
  ListExtensionsDocument,
  ListExtensionsQuery,
  ListExtensionsQueryVariables,
} from '~graphql';
import { notNull, output } from '~utils';
import { addEventListener } from '~eventListeners';

import { addNetworkEventListener } from './network';

const fetchExtensions = async (
  extensionHash: string,
): Promise<ExtensionFragment[]> => {
  const extensions = [];
  let nextToken: string | undefined;

  do {
    const { data } =
      (await query<ListExtensionsQuery, ListExtensionsQueryVariables>(
        ListExtensionsDocument,
        {
          nextToken,
          hash: extensionHash,
        },
      )) ?? {};

    const { items } = data?.getExtensionsByHash ?? {};
    extensions.push(...(items ?? []));

    nextToken = data?.getExtensionsByHash?.nextToken ?? '';
  } while (nextToken);

  return extensions.filter(notNull);
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
  const addresses = await fetchExtensions(extensionHash);
  addresses.forEach((extension) =>
    setupListenersForExtension(
      extension.id,
      extensionHash,
      extension.isInitialized,
    ),
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
  isInitialized: boolean,
): void => {
  if (extensionHash === getExtensionHash(Extension.VotingReputation)) {
    if (isInitialized) {
      setupMotionsListeners(extensionAddress);
    } else {
      addEventListener({
        eventSignature: ContractEventsSignatures.ExtensionInitialised,
        address: extensionAddress,
        clientType: ClientType.VotingReputationClient,
      });
    }
  }
};

export const setupMotionsListeners = (
  votingReputationAddress: string,
): void => {
  const motionEvents = [
    ContractEventsSignatures.MotionCreated,
    ContractEventsSignatures.MotionStaked,
    ContractEventsSignatures.MotionFinalized,
    ContractEventsSignatures.MotionRewardClaimed,
    ContractEventsSignatures.MotionVoteSubmitted,
    ContractEventsSignatures.MotionVoteRevealed,
  ];

  motionEvents.forEach((eventSignature) =>
    addEventListener({
      clientType: ClientType.VotingReputationClient,
      eventSignature,
      address: votingReputationAddress,
    }),
  );
};
