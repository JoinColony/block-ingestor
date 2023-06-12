import { ClientType } from '@colony/colony-js';

import { query } from '~amplifyClient';
import {
  ListColoniesDocument,
  ListColoniesQuery,
  ListColoniesQueryVariables,
} from '~graphql';
import { ContractEventsSignatures } from '~types';
import { notNull } from '~utils';
import { addEventListener } from '~eventListeners';

import { EventHandler } from './types';

const addColonyEventListener = (
  eventSignature: ContractEventsSignatures,
  address: string,
  handler: EventHandler,
): void => {
  addEventListener({
    clientType: ClientType.ColonyClient,
    eventSignature,
    address,
    handler,
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
  addColonyEventListener(
    ContractEventsSignatures.DomainAdded,
    colonyAddress,
    () => {
      console.log('Domain Added');
    },
  );
  addColonyEventListener(
    ContractEventsSignatures.DomainMetadata,
    colonyAddress,
    () => {
      console.log('Domain Metadata');
    },
  );
};
