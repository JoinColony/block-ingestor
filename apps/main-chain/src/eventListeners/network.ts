import {
  EventListenerType,
  ContractEventsSignatures,
  EventHandler,
} from '@joincolony/blocks';
import { utils } from 'ethers';

import eventManager from '~eventManager';

export const addNetworkEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
): void =>
  eventManager.addEventListener({
    type: EventListenerType.Network,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_NETWORK_CONTRACT ?? '',
    handler,
  });
