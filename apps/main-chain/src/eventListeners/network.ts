import { utils } from 'ethers';

import { EventListenerType, addEventListener } from '~eventListeners';
import { ContractEventsSignatures, EventHandler } from '~types';

export const addNetworkEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
): void =>
  addEventListener({
    type: EventListenerType.Network,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_CONTRACT_ADDRESS ?? '',
    handler,
  });
