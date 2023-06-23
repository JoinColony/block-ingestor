import { ContractEventsSignatures } from '~types';
import { addEventListener } from '~eventListeners';
import { EventListenerType } from './types';
import { utils } from 'ethers';

/**
 * @NOTE: Currently, token event listeners only support filtering on the recipient address
 */
export const addTokenEventListener = (
  eventSignature: ContractEventsSignatures,
  recipientAddress: string,
): void => {
  addEventListener({
    type: EventListenerType.Token,
    eventSignature,
    topics: [utils.id(eventSignature), null, recipientAddress],
  });
};
