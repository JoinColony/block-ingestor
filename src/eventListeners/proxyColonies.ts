import { utils } from 'ethers';

import { EventListenerType, addEventListener } from '~eventListeners';
import { ContractEventsSignatures, EventHandler } from '~types';

export const addProxyColoniesEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
): void =>
  addEventListener({
    type: EventListenerType.ProxyColonies,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_CONTRACT_ADDRESS ?? '',
    handler,
  });
