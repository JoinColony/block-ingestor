import { utils } from 'ethers';

import { EventListenerType, addEventListener } from '~eventListeners';
import { ContractEventsSignatures } from '~types';

export const addNetworkEventListener = (
  eventSignature: ContractEventsSignatures,
): void =>
  addEventListener({
    type: EventListenerType.Network,
    eventSignature,
    topics: [utils.id(eventSignature)],
    address: process.env.CHAIN_CONTRACT_ADDRESS ?? '',
  });
