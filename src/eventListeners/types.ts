import { ContractEventsSignatures, EventHandler } from '~types';

export interface BaseEventListener {
  type: EventListenerType;
  eventSignature: ContractEventsSignatures;
  topics: Array<string | null>;
  handler: EventHandler;
  address?: string;
}

export enum EventListenerType {
  Colony = 'Colony',
  Network = 'Network',
  VotingReputation = 'VotingReputation',
  Extension = 'Extension',
  Token = 'Token',
  OneTxPayment = 'OneTxPayment',
  MultisigPermissions = 'MultisigPermissions',
}

export interface ColonyEventListener extends BaseEventListener {
  type: EventListenerType.Colony;
  address: string;
}

export interface NetworkEventListener extends BaseEventListener {
  type: EventListenerType.Network;
  address: string;
}

// Special listener just for Token transfers
// Due to the volume of these events, we can't process them in the same way
// as the normal events
export interface TokenTransferEventListener extends BaseEventListener {
  type: EventListenerType.Token;
}

export interface TokenEventListener extends BaseEventListener {
  type: EventListenerType.Token;
  address: string;
}

export interface ExtensionEventListener extends BaseEventListener {
  type: EventListenerType.Extension;
  address: string;
  colonyAddress: string;
  extensionHash: string;
  handler: EventHandler;
}

export type EventListener =
  | ColonyEventListener
  | NetworkEventListener
  | TokenEventListener
  | TokenTransferEventListener
  | ExtensionEventListener;
