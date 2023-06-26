import { utils } from 'ethers';
import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import {
  EventListenerType,
  addEventListener,
  getEventListeners,
  setEventListeners,
} from '~eventListeners';
import {
  ExtensionFragment,
  ListExtensionsDocument,
  ListExtensionsQuery,
  ListExtensionsQueryVariables,
} from '~graphql';
import { query } from '~amplifyClient';
import { notNull, output } from '~utils';

export const addVotingReputationEventListener = (
  eventSignature: ContractEventsSignatures,
  extensionAddress: string,
  colonyAddress: string,
): void => {
  addEventListener({
    type: EventListenerType.VotingReputation,
    eventSignature,
    address: extensionAddress,
    colonyAddress,
    topics: [utils.id(eventSignature)],
  });
};

export const removeVotingReputationListeners = (
  colonyAddress: string,
): void => {
  const existingListeners = getEventListeners();
  setEventListeners(
    existingListeners.filter((listener) => {
      if (listener.type !== EventListenerType.VotingReputation) {
        return true;
      }

      return listener.colonyAddress !== colonyAddress;
    }),
  );
};

const fetchExistingVotingReputationExtensions = async (): Promise<
  ExtensionFragment[]
> => {
  const extensions = [];
  let nextToken: string | undefined;

  do {
    const { data } =
      (await query<ListExtensionsQuery, ListExtensionsQueryVariables>(
        ListExtensionsDocument,
        {
          nextToken,
          hash: getExtensionHash(Extension.VotingReputation),
        },
      )) ?? {};

    const { items } = data?.getExtensionsByHash ?? {};
    extensions.push(...(items ?? []));

    nextToken = data?.getExtensionsByHash?.nextToken ?? '';
  } while (nextToken);

  return extensions.filter(notNull);
};

export const setupListenersForVotingReputationExtensions =
  async (): Promise<void> => {
    output(`Setting up listeners for VotingReputation extensions`);
    const existingExtensions = await fetchExistingVotingReputationExtensions();
    existingExtensions.forEach((extension) =>
      setupListenersForVotingReputation(
        extension.id,
        extension.colonyId,
        extension.isInitialized,
      ),
    );
  };

export const setupListenersForVotingReputation = (
  votingReputationAddress: string,
  colonyAddress: string,
  isInitialized: boolean,
): void => {
  if (isInitialized) {
    setupMotionsListeners(votingReputationAddress, colonyAddress);
  } else {
    addVotingReputationEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      votingReputationAddress,
      colonyAddress,
    );
  }
};

export const setupMotionsListeners = (
  votingReputationAddress: string,
  colonyAddress: string,
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
    addVotingReputationEventListener(
      eventSignature,
      votingReputationAddress,
      colonyAddress,
    ),
  );
};
