import { ClientType } from '@colony/colony-js';

import { query } from '~amplifyClient';
import {
  ListColoniesDocument,
  ListColoniesQuery,
  ListColoniesQueryVariables,
} from '~graphql';
import { ContractEventsSignatures } from '~types';
import { notNull, output } from '~utils';
import { addEventListener } from '~eventListeners';

const addColonyEventListener = (
  eventSignature: ContractEventsSignatures,
  address: string,
): void => {
  addEventListener({
    clientType: ClientType.ColonyClient,
    eventSignature,
    address,
  });
};

const fetchColoniesAddresses = async (): Promise<string[]> => {
  const colonies = [];
  let nextToken: string | undefined;

  do {
    const { data } =
      (await query<ListColoniesQuery, ListColoniesQueryVariables>(
        ListColoniesDocument,
        { nextToken },
      )) ?? {};

    const { items } = data?.listColonies ?? {};
    colonies.push(...(items ?? []));

    nextToken = data?.listColonies?.nextToken ?? '';
  } while (nextToken);

  return colonies.filter(notNull).map((colony) => colony.id);
};

export const setupListenersForExistingColonies = async (): Promise<void> => {
  const addresses = await fetchColoniesAddresses();
  addresses.forEach((colonyAddress) => {
    setupListenersForColony(colonyAddress);
  });
};

const setupListenersForColony = (colonyAddress: string): void => {
  output(`Setting up listeners for colony ${colonyAddress}`);

  const colonyEvents = [
    ContractEventsSignatures.ColonyFundsClaimed,
    ContractEventsSignatures.ColonyUpgraded,
    ContractEventsSignatures.TokensMinted,
    ContractEventsSignatures.PaymentAdded,
    ContractEventsSignatures.DomainAdded,
    ContractEventsSignatures.DomainMetadata,
    ContractEventsSignatures.TokenUnlocked,
    ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots,
    ContractEventsSignatures.ColonyMetadata,
    ContractEventsSignatures.ArbitraryReputationUpdate,
    ContractEventsSignatures.ColonyRoleSet,
    ContractEventsSignatures.RecoveryRoleSet,
    ContractEventsSignatures.ColonyRoleSet_OLD,
  ];

  colonyEvents.forEach((eventSignature) =>
    addColonyEventListener(eventSignature, colonyAddress),
  );

  // @TODO: Add token event listener
};
