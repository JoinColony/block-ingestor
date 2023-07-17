import { utils } from 'ethers';

import { query } from '~amplifyClient';
import {
  ListColoniesDocument,
  ListColoniesQuery,
  ListColoniesQueryVariables,
} from '~graphql';
import { ContractEventsSignatures } from '~types';
import { notNull, output } from '~utils';
import {
  addEventListener,
  addNetworkEventListener,
  addTokenEventListener,
} from '~eventListeners';

import { EventListenerType } from './types';

const addColonyEventListener = (
  eventSignature: ContractEventsSignatures,
  address: string,
): void => {
  addEventListener({
    type: EventListenerType.Colony,
    address,
    eventSignature,
    topics: [utils.id(eventSignature)],
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

export const setupListenersForColonies = async (): Promise<void> => {
  const addresses = await fetchColoniesAddresses();
  addresses.forEach((colonyAddress) => {
    setupListenersForColony(colonyAddress);
  });

  addNetworkEventListener(ContractEventsSignatures.ColonyAdded);
};

export const setupListenersForColony = (colonyAddress: string): void => {
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
    ContractEventsSignatures.ExpenditureAdded,
    ContractEventsSignatures.ExpenditureRecipientSet,
    ContractEventsSignatures.ExpenditurePayoutSet,
    ContractEventsSignatures.ExpenditureLocked,
  ];

  colonyEvents.forEach((eventSignature) =>
    addColonyEventListener(eventSignature, colonyAddress),
  );

  addTokenEventListener(ContractEventsSignatures.Transfer, colonyAddress);
};
