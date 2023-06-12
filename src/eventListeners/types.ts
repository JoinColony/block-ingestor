import { ClientType } from '@colony/colony-js';
import { ContractEventsSignatures } from '~types';

export interface EventListener {
  eventSignature: ContractEventsSignatures;
  clientType: ClientType;
  address?: string;
}
