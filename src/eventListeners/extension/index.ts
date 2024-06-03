import { utils } from 'ethers';
import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEventsSignatures, EventHandler } from '~types';
import {
  EventListenerType,
  addEventListener,
  getEventListeners,
  setEventListeners,
  setupListenerForOneTxPaymentExtensions,
  setupListenersForStagedExpenditureExtensions,
} from '~eventListeners';
import {
  ExtensionFragment,
  ListExtensionsDocument,
  ListExtensionsQuery,
  ListExtensionsQueryVariables,
} from '~graphql';
import { query } from '~amplifyClient';
import { notNull } from '~utils';

import { addNetworkEventListener } from '../network';
import { setupListenersForVotingReputationExtensions } from './votingReputation';
import { setupListenersForStakedExpenditureExtensions } from './stakedExpenditure';
import { setupListenersForStreamingPaymentsExtensions } from './streamingPayments';
import {
  handleExtensionAddedToNetwork,
  handleExtensionDeprecated,
  handleExtensionInstalled,
  handleExtensionUninstalled,
  handleExtensionUpgraded,
} from '~handlers';

export * from './stakedExpenditure';
export * from './stagedExpenditure';
export * from './votingReputation';
export * from './oneTxPayment';

export const addExtensionEventListener = (
  eventSignature: ContractEventsSignatures,
  extensionId: Extension,
  extensionAddress: string,
  colonyAddress: string,
  handler: EventHandler,
): void => {
  addEventListener({
    type: EventListenerType.Extension,
    eventSignature,
    address: extensionAddress,
    colonyAddress,
    topics: [utils.id(eventSignature)],
    extensionHash: getExtensionHash(extensionId),
    handler,
  });
};

export const removeExtensionEventListeners = (
  extensionAddress: string,
): void => {
  const existingListeners = getEventListeners();
  setEventListeners(
    existingListeners.filter((listener) => {
      if (listener.type !== EventListenerType.Extension) {
        return true;
      }

      return listener.address !== extensionAddress;
    }),
  );
};

export const setupListenersForExtensions = async (): Promise<void> => {
  const extensionEventHandlers = {
    [ContractEventsSignatures.ExtensionAddedToNetwork]:
      handleExtensionAddedToNetwork,
    [ContractEventsSignatures.ExtensionInstalled]: handleExtensionInstalled,
    [ContractEventsSignatures.ExtensionUninstalled]: handleExtensionUninstalled,
    [ContractEventsSignatures.ExtensionDeprecated]: handleExtensionDeprecated,
    [ContractEventsSignatures.ExtensionUpgraded]: handleExtensionUpgraded,
  };

  Object.entries(extensionEventHandlers).forEach(([eventSignature, handler]) =>
    addNetworkEventListener(
      eventSignature as ContractEventsSignatures,
      handler,
    ),
  );

  setupListenerForOneTxPaymentExtensions();
  setupListenersForVotingReputationExtensions();
  setupListenersForStakedExpenditureExtensions();
  setupListenersForStagedExpenditureExtensions();
  setupListenersForStreamingPaymentsExtensions();
};

export const fetchExistingExtensions = async (
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
