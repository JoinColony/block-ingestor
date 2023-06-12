import { ClientType } from '@colony/colony-js/tokens';
import { addEventListener } from '~eventListeners';
import { ContractEventsSignatures } from '~types';

export const addNetworkEventListener = (
  eventSignature: ContractEventsSignatures,
): void =>
  addEventListener({
    eventSignature,
    clientType: ClientType.NetworkClient,
  });
