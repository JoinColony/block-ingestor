import { ContractEventsSignatures, EventHandler } from '~types';
import { addEventListener, getEventListeners } from '~eventListeners';
import { EventListenerType, EventListener } from './types';
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
  const listenerExists = getEventListeners().some((existingListener) =>
    isEqual(existingListener, tokenListener),
  );
  if (listenerExists) {
    return;
  }

  return addEventListener(tokenListener);
};
