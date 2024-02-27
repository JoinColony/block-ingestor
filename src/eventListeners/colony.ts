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

const fetchColoniesAddresses = async (): Promise<
  Array<{
    colonyAddress: string;
    tokenAddress: string;
  }>
> => {
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

  return colonies.filter(notNull).map((colony) => ({
    colonyAddress: colony.id,
    tokenAddress: colony.nativeTokenId,
  }));
};

export const setupListenersForColonies = async (): Promise<void> => {
  const addresses = await fetchColoniesAddresses();
  addresses.forEach(({ colonyAddress, tokenAddress }) => {
    setupListenersForColony(colonyAddress, tokenAddress);
  });

  addNetworkEventListener(ContractEventsSignatures.ColonyAdded);
  addNetworkEventListener(ContractEventsSignatures.ColonyVersionAdded);
  addNetworkEventListener(
    ContractEventsSignatures.ReputationMiningCycleComplete,
  );
};

export const setupListenersForColony = (
  colonyAddress: string,
  tokenAddress: string,
): void => {
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
    ContractEventsSignatures.ExpenditureGlobalClaimDelaySet,
    ContractEventsSignatures.ExpenditureAdded,
    ContractEventsSignatures.ExpenditureRecipientSet,
    ContractEventsSignatures.ExpenditurePayoutSet,
    ContractEventsSignatures.ExpenditureLocked,
    ContractEventsSignatures.ExpenditureCancelled,
    ContractEventsSignatures.ExpenditureFinalized,
    ContractEventsSignatures.ExpenditureTransferred,
    ContractEventsSignatures.ExpenditureClaimDelaySet,
    ContractEventsSignatures.ExpenditurePayoutModifierSet,
    ContractEventsSignatures.ExpenditurePayoutClaimed,
    ContractEventsSignatures.ExpenditureStateChanged,
    ContractEventsSignatures.AnnotateTransaction,
    ContractEventsSignatures.ArbitraryTransaction,
    ContractEventsSignatures.ColonyMetadataDelta,
  ];

  colonyEvents.forEach((eventSignature) =>
    addColonyEventListener(eventSignature, colonyAddress),
  );

  /*
   * @NOTE Setup both token event listners
   *
   * Once we have more we might want to do a similar pattern like the above,
   * as well as probably move them to their own setup function
   */
  addTokenEventListener(
    ContractEventsSignatures.Transfer,
    undefined,
    colonyAddress,
  );
  addTokenEventListener(ContractEventsSignatures.LogSetAuthority, tokenAddress);
  addTokenEventListener(ContractEventsSignatures.LogSetOwner, tokenAddress);
};
