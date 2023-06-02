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
} from '~utils';

interface HandlerMappingType {
  [key: string]: ColonyActionHandler;
}

/**
 * This function get logs for a particular event, parses them and call a relevant action handler to act upon it
 *
 * @NOTE This can only work with an archive node, as well as one that can display more than 10000 events.
 * Most commercial solutions out there limit to around 10k events in the past, plus that not everyone will give up an archive node.
 * So this can only work with our custom, nethermind based node.
 */
const trackActionsByEvent = async (
  colonyAddress: string,
  handlerMapping: HandlerMappingType,
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);

  const filter: Filter = {
    topics: [Object.keys(handlerMapping).map((x) => utils.id(x))],
    address: colonyAddress,
  };
  filter.fromBlock = await getLatestBlock();
  const logs = await networkClient.provider.getLogs(filter);
  logs.forEach(async (log) => {
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }
    await handlerMapping[event.signature](event);
  });
};

export default async (colonyAddress: string): Promise<void> => {
  verbose('Fetching past actions for colony:', colonyAddress);

  const handlerMapping: HandlerMappingType = {};

  handlerMapping[ContractEventsSignatures.TokensMinted] =
    handleMintTokensAction;
  handlerMapping[ContractEventsSignatures.PaymentAdded] = handlePaymentAction;
  handlerMapping[ContractEventsSignatures.TokenUnlocked] =
    handleTokenUnlockedAction;
  handlerMapping[ContractEventsSignatures.DomainAdded] =
    handleCreateDomainAction;
  handlerMapping[ContractEventsSignatures.DomainMetadata] =
    handleEditDomainAction;
  handlerMapping[ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots] =
    handleMoveFundsAction;
  handlerMapping[ContractEventsSignatures.ColonyMetadata] =
    handleEditColonyAction;
  handlerMapping[ContractEventsSignatures.ColonyUpgraded] =
    handleVersionUpgradeAction;
  handlerMapping[ContractEventsSignatures.ArbitraryReputationUpdate] =
    handleEmitDomainReputationAction;
  handlerMapping[ContractEventsSignatures.ColonyRoleSet] =
    handleManagePermissionsAction;

  await trackActionsByEvent(colonyAddress, handlerMapping);
};
