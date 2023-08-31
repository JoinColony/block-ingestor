import { utils } from 'ethers';
import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import {
  EventListenerType,
  addEventListener,
  getEventListeners,
  setEventListeners,
} from '~eventListeners';
import { notNull, output } from '~utils';
import {
  ExtensionFragment,
  ListExtensionsDocument,
  ListExtensionsQuery,
  ListExtensionsQueryVariables,
} from '~graphql';
import { query } from '~amplifyClient';

export const addStakedExpenditureEventListener = (
  eventSignature: ContractEventsSignatures,
  extensionAddress: string,
  colonyAddress: string,
): void => {
  addEventListener({
    type: EventListenerType.StakedExpenditure,
    eventSignature,
    address: extensionAddress,
    colonyAddress,
    topics: [utils.id(eventSignature)],
  });
};

export const removeStakedExpenditureListeners = (
  colonyAddress: string,
): void => {
  const existingListeners = getEventListeners();
  setEventListeners(
    existingListeners.filter((listener) => {
      if (listener.type !== EventListenerType.StakedExpenditure) {
        return true;
      }

      return listener.colonyAddress !== colonyAddress;
    }),
  );
};

export const setupListenersForStakedExpenditureExtensions =
  async (): Promise<void> => {
    output(`Setting up listeners for StakedExpenditure extensions`);
    const existingExtensions = await fetchExistingStakedExpenditureExtensions();
    existingExtensions.forEach((extension) =>
      setupListenersForStakedExpenditure(
        extension.id,
        extension.colonyId,
        extension.isInitialized,
      ),
    );
  };

const fetchExistingStakedExpenditureExtensions = async (): Promise<
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
          hash: getExtensionHash(Extension.StakedExpenditure),
        },
      )) ?? {};

    const { items } = data?.getExtensionsByHash ?? {};
    extensions.push(...(items ?? []));

    nextToken = data?.getExtensionsByHash?.nextToken ?? '';
  } while (nextToken);

  return extensions.filter(notNull);
};

export const setupListenersForStakedExpenditure = (
  stakedExpenditureAddress: string,
  colonyAddress: string,
  isInitialized: boolean,
): void => {
  if (isInitialized) {
    addStakedExpenditureEventListener(
      ContractEventsSignatures.StakeReclaimed,
      stakedExpenditureAddress,
      colonyAddress,
    );
  } else {
    addStakedExpenditureEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      stakedExpenditureAddress,
      colonyAddress,
    );
  }
};
