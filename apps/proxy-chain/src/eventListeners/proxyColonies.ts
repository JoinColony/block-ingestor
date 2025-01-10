import { utils } from 'ethers';

import {
  ContractEventsSignatures,
  EventHandler,
  EventListenerType,
} from '@joincolony/blocks';
import eventManager from '~eventManager';

export const addProxyColoniesNetworkEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
): void =>
  eventManager.addEventListener({
    type: EventListenerType.ProxyColonies,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_NETWORK_CONTRACT ?? '',
    handler,
  });
