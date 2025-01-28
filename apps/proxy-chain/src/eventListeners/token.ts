import {
  ContractEventsSignatures,
  EventHandler,
  EventListenerType,
  EventListener,
} from '@joincolony/blocks';
import eventManager from '~eventManager';
import { utils } from 'ethers';
import isEqual from 'lodash/isEqual';

export const addTokenEventListener = (
  eventSignature: ContractEventsSignatures,
  handler: EventHandler,
  tokenAddress?: string,
  recipientAddress?: string,
): void => {
  const tokenListener: EventListener = {
    type: EventListenerType.Token,
    eventSignature,
    address: tokenAddress,
    topics: [utils.id(eventSignature)],
    handler,
  };

  if (recipientAddress) {
    /*
     * Filter transfer events for the recipient address
     */
    tokenListener.topics.push(null, utils.hexZeroPad(recipientAddress, 32));
  }

  /*
   * @NOTE This only applies to contract listeners
   *
   * Ie: any listener that has and address property.
   * As a general rule, this will only *NOT* apply to the token Transfer event
   * as that's the only one treated differently.
   */
  const listenerExists = eventManager
    .getEventListeners()
    .some((existingListener) => isEqual(existingListener, tokenListener));
  if (listenerExists) {
    return;
  }

  return eventManager.addEventListener(tokenListener);
};
