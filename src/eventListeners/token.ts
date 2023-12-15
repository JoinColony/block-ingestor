import { ContractEventsSignatures } from '~types';
import { addEventListener, getEventListeners } from '~eventListeners';
import { EventListenerType, EventListener } from './types';
import { utils } from 'ethers';

export const addTokenEventListener = (
  eventSignature: ContractEventsSignatures,
  recipientAddress: string,
): void => {
  /*
   * @NOTE This only applies to contract listeners
   *
   * Ie: any listener that has and address property.
   * As a general rule, this will only *NOT* apply to the token Transfer event
   * as that's the only one treated differently.
   */
  const listenerExists = getEventListeners().some(
    (listener) =>
      listener.type === EventListenerType.Token &&
      listener.address === recipientAddress,
  );

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

  if (!listenerExists) {
    return addEventListener(tokenListener);
  }
};
