import { ContractEventsSignatures } from '~types';

export interface BaseEventListener {
  type: EventListenerType;
  eventSignature: ContractEventsSignatures;
  topics: Array<string | null>;
  address?: string;
}

export enum EventListenerType {
  Colony = 'Colony',
  Network = 'Network',
  Extension = 'Extension',
  Token = 'Token',
}

interface ColonyEventListener extends BaseEventListener {
  type: EventListenerType.Colony;
  address: string;
}

interface NetworkEventListener extends BaseEventListener {
  type: EventListenerType.Network;
  address: string;
}

interface TokenEventListener extends BaseEventListener {
  type: EventListenerType.Token;
}

interface ExtensionEventListener extends BaseEventListener {
  type: EventListenerType.Extension;
  address: string;
  colonyAddress: string;
  extensionHash: string;
}

export type EventListener =
  | ColonyEventListener
  | NetworkEventListener
  | TokenEventListener
  | ExtensionEventListener;
