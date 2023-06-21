import { ClientType } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';
import { addEventListener } from '~eventListeners';

/**
 * @NOTE: Currently, adding a token listener will use the address argument
 * to filter events where the address is the recipient
 * @TODO: Extend the token listener to support adding listeners filtering
 * on token address/sender address
 */
export const addTokenEventListener = (
  eventSignature: ContractEventsSignatures,
  address: string,
): void => {
  addEventListener({
    clientType: ClientType.TokenClient,
    eventSignature,
    address,
  });
};
