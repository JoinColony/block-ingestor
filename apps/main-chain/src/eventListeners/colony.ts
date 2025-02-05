import { utils } from 'ethers';

import amplifyClient from '~amplifyClient';
import {
  ListColoniesDocument,
  ListColoniesQuery,
  ListColoniesQueryVariables,
} from '@joincolony/graphql';
import {
  ContractEventsSignatures,
  EventHandler,
  EventListenerType,
} from '@joincolony/blocks';
import { notNull } from '~utils';
import {
  addNetworkEventListener,
  addTokenEventListener,
} from '~eventListeners';

import {
  handleAnnotateTransaction,
  handleColonyAdded,
  handleColonyFundsClaimed,
  handleColonyMetadataDelta,
  handleColonyUpgradeAction,
  handleColonyVersionAdded,
  handleCreateDomainAction,
  handleEditColonyAction,
  handleEditDomainAction,
  handleEmitDomainReputationAction,
  handleExpenditureAdded,
  handleExpenditureCancelled,
  handleExpenditureClaimDelaySet,
  handleExpenditureFinalized,
  handleExpenditureGlobalClaimDelaySet,
  handleExpenditureLocked,
  handleExpenditurePayoutClaimed,
  handleExpenditurePayoutModifierSet,
  handleExpenditurePayoutSet,
  handleExpenditureRecipientSet,
  handleExpenditureStateChanged,
  handleExpenditureTransferred,
  handleMakeAbitraryTransactionAction,
  handleManagePermissionsAction,
  handleMintTokensAction,
  handleMoveFundsAction,
  handleReputationMiningCycleComplete,
  handleSetTokenAuthority,
  handleTokenUnlockedAction,
  handleTransfer,
} from '~handlers';
import {
  handleProxyColonyRequested,
  handleProxyColonyFundsClaimed,
} from '~handlers/proxyColonies';
import setTokenAuthority from '~handlers/tokens/setTokenAuthority';
import { addProxyColoniesEventListener } from './proxyColonies';
import { output } from '@joincolony/utils';
import eventManager from '~eventManager';

const addColonyEventListener = (
  eventSignature: ContractEventsSignatures,
  address: string,
  handler: EventHandler,
): void => {
  eventManager.addEventListener({
    type: EventListenerType.Colony,
    address,
    eventSignature,
    topics: [utils.id(eventSignature)],
    handler,
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
      (await amplifyClient.query<ListColoniesQuery, ListColoniesQueryVariables>(
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

  addNetworkEventListener(
    ContractEventsSignatures.ColonyAdded,
    handleColonyAdded,
  );
  addNetworkEventListener(
    ContractEventsSignatures.ColonyVersionAdded,
    handleColonyVersionAdded,
  );
  addNetworkEventListener(
    ContractEventsSignatures.ReputationMiningCycleComplete,
    handleReputationMiningCycleComplete,
  );
};

export const setupListenersForColony = (
  colonyAddress: string,
  tokenAddress: string,
): void => {
  output(`Setting up listeners for colony ${colonyAddress}`);

  const colonyEventHandlers = {
    [ContractEventsSignatures.ColonyFundsClaimed]: handleColonyFundsClaimed,
    [ContractEventsSignatures.ColonyUpgraded]: handleColonyUpgradeAction,
    [ContractEventsSignatures.TokensMinted]: handleMintTokensAction,
    [ContractEventsSignatures.DomainAdded]: handleCreateDomainAction,
    [ContractEventsSignatures.DomainMetadata]: handleEditDomainAction,
    [ContractEventsSignatures.TokenUnlocked]: handleTokenUnlockedAction,
    [ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots]:
      handleMoveFundsAction,
    [ContractEventsSignatures.ColonyMetadata]: handleEditColonyAction,
    [ContractEventsSignatures.ArbitraryReputationUpdate]:
      handleEmitDomainReputationAction,
    [ContractEventsSignatures.ColonyRoleSet]: handleManagePermissionsAction,
    [ContractEventsSignatures.RecoveryRoleSet]: handleManagePermissionsAction,
    [ContractEventsSignatures.ColonyRoleSet_OLD]: handleManagePermissionsAction,
    [ContractEventsSignatures.ExpenditureGlobalClaimDelaySet]:
      handleExpenditureGlobalClaimDelaySet,
    [ContractEventsSignatures.ExpenditureAdded]: handleExpenditureAdded,
    [ContractEventsSignatures.ExpenditureRecipientSet]:
      handleExpenditureRecipientSet,
    [ContractEventsSignatures.ExpenditurePayoutSetOld]:
      handleExpenditurePayoutSet,
    [ContractEventsSignatures.ExpenditureLocked]: handleExpenditureLocked,
    [ContractEventsSignatures.ExpenditureCancelled]: handleExpenditureCancelled,
    [ContractEventsSignatures.ExpenditureFinalized]: handleExpenditureFinalized,
    [ContractEventsSignatures.ExpenditureTransferred]:
      handleExpenditureTransferred,
    [ContractEventsSignatures.ExpenditureClaimDelaySet]:
      handleExpenditureClaimDelaySet,
    [ContractEventsSignatures.ExpenditurePayoutModifierSet]:
      handleExpenditurePayoutModifierSet,
    [ContractEventsSignatures.ExpenditurePayoutClaimed]:
      handleExpenditurePayoutClaimed,
    [ContractEventsSignatures.ExpenditureStateChanged]:
      handleExpenditureStateChanged,
    [ContractEventsSignatures.AnnotateTransaction]: handleAnnotateTransaction,
    [ContractEventsSignatures.ArbitraryTransaction]:
      handleMakeAbitraryTransactionAction,
    [ContractEventsSignatures.ColonyMetadataDelta]: handleColonyMetadataDelta,
  };

  Object.entries(colonyEventHandlers).forEach(([eventSignature, handler]) =>
    addColonyEventListener(
      eventSignature as ContractEventsSignatures,
      colonyAddress,
      handler,
    ),
  );

  addProxyColoniesEventListener(
    ContractEventsSignatures.ProxyColonyRequested,
    colonyAddress,
    handleProxyColonyRequested,
  );

  addProxyColoniesEventListener(
    ContractEventsSignatures.ProxyColonyFundsClaimed,
    colonyAddress,
    handleProxyColonyFundsClaimed,
  );

  /*
   * @NOTE Setup both token event listners
   *
   * Once we have more we might want to do a similar pattern like the above,
   * as well as probably move them to their own setup function
   */
  addTokenEventListener(
    ContractEventsSignatures.Transfer,
    handleTransfer,
    undefined,
    colonyAddress,
  );
  addTokenEventListener(
    ContractEventsSignatures.LogSetAuthority,
    handleSetTokenAuthority,
    tokenAddress,
  );
  addTokenEventListener(
    ContractEventsSignatures.LogSetOwner,
    setTokenAuthority,
    tokenAddress,
  );
};
