import { ContractEventsSignatures } from '~types';
import { addEventListener } from '~eventListeners';
import { EventListenerType, EventListener } from './types';
import { utils } from 'ethers';

export const addTokenEventListener = (
  eventSignature: ContractEventsSignatures,
  recipientAddress: string,
): void => {
  const tokenListener: EventListener = {
    type: EventListenerType.Token,
    eventSignature,
    address: recipientAddress,
    topics: [utils.id(eventSignature)],
  };

  if (eventSignature === ContractEventsSignatures.Transfer) {
    /*
     * Filter transfer events for the recipient address
     */
    tokenListener.topics.push(null, recipientAddress);
    delete tokenListener.address;
  }

  return addEventListener(tokenListener);
};
