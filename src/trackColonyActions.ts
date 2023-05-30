import { getLogs } from '@colony/colony-js';
import { utils } from 'ethers';

import {
  handleCreateDomainAction,
  handleEditColonyAction,
  handleEditDomainAction,
  handleEmitDomainReputationAction,
  handleMintTokensAction,
  handleMoveFundsAction,
  handlePaymentAction,
  handleTokenUnlockedAction,
  handleVersionUpgradeAction,
  handleManagePermissionsAction,
} from '~handlers';
import networkClient from '~networkClient';
import { ColonyActionHandler, ContractEventsSignatures, Filter } from '~types';
import {
  getCachedColonyClient,
  getLatestBlock,
  mapLogToContractEvent,
  verbose,
} from '~utils';

const getFilter = (
  eventSignature: ContractEventsSignatures,
  colonyAddress: string,
): Filter => ({
  topics: [utils.id(eventSignature)],
  address: colonyAddress,
});

/**
 * This function get logs for a particular event, parses them and call a relevant action handler to act upon it
 *
 * @NOTE This can only work with an archive node, as well as one that can display more than 10000 events.
 * Most commercial solutions out there limit to around 10k events in the past, plus that not everyone will give up an archive node.
 * So this can only work with our custom, nethermind based node.
 */
const trackActionsByEvent = async (
  eventSignature: ContractEventsSignatures,
  colonyAddress: string,
  handler: ColonyActionHandler,
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const filter = getFilter(eventSignature, colonyAddress);
  const logs = await getLogs(networkClient, filter, {
    fromBlock: getLatestBlock(),
  });
  logs.forEach(async (log) => {
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }

    handler(event);
  });
};

export default async (colonyAddress: string): Promise<void> => {
  verbose('Fetching past actions for colony:', colonyAddress);
  await trackActionsByEvent(
    ContractEventsSignatures.TokensMinted,
    colonyAddress,
    handleMintTokensAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.PaymentAdded,
    colonyAddress,
    handlePaymentAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.TokenUnlocked,
    colonyAddress,
    handleTokenUnlockedAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.DomainAdded,
    colonyAddress,
    handleCreateDomainAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.DomainMetadata,
    colonyAddress,
    handleEditDomainAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots,
    colonyAddress,
    handleMoveFundsAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.ColonyMetadata,
    colonyAddress,
    handleEditColonyAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.ColonyUpgraded,
    colonyAddress,
    handleVersionUpgradeAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.ArbitraryReputationUpdate,
    colonyAddress,
    handleEmitDomainReputationAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.ColonyRoleSet,
    colonyAddress,
    handleManagePermissionsAction,
  );
};
