import { utils } from 'ethers';

import { ContractEventsSignatures, EventHandler } from '~types';
import eventManager from '~eventManager';
import { EventListenerType } from '@joincolony/blocks';

export const addProxyColoniesEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
): void =>
  eventManager.addEventListener({
    type: EventListenerType.ProxyColonies,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_CONTRACT_ADDRESS ?? '',
    handler,
  });
