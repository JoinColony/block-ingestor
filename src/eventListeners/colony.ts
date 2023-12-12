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
  addTokenTransferEventListener,
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
    ContractEventsSignatures.AnnotateTransaction,
    ContractEventsSignatures.ArbitraryTransaction,
  ];

  colonyEvents.forEach((eventSignature) =>
    addColonyEventListener(eventSignature, colonyAddress),
  );

  const tokenEvents = [
    ContractEventsSignatures.Transfer,
    ContractEventsSignatures.LogSetAuthority,
  ];

  /*
   * @TODO once there are more relevant events in this list, we should extract this
   * listener separately and run it for each token we see within our network
   *
   * Currently it works as we only care about one specific event which only happens
   * on colony creation (Transfer doesn't count as it's being handled differently)
   */
  tokenEvents.forEach((eventSignature) => {
    // This needs to be handled individually because transfer events are frequent and heavy
    if (eventSignature === ContractEventsSignatures.Transfer) {
      return addTokenTransferEventListener(eventSignature, colonyAddress);
    }
    return addTokenEventListener(eventSignature, tokenAddress);
  });
};
