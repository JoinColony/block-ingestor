import { ClientType } from '@colony/colony-js';
import { ContractEvent, ContractEventsSignatures } from '~types';

export type EventHandler = (event: ContractEvent) => void | Promise<void>;

export interface EventListener {
  eventSignature: ContractEventsSignatures;
  clientType: ClientType;
  address: string;
  handler: EventHandler;
}
