import { EventListenerType } from '@joincolony/blocks';
import { utils } from 'ethers';

import eventManager from '~eventManager';
import { ContractEventsSignatures, EventHandler } from '~types';

export const addNetworkEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
): void =>
  eventManager.addEventListener({
    type: EventListenerType.Network,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_CONTRACT_ADDRESS ?? '',
    handler,
  });
