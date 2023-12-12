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
  VotingReputation = 'VotingReputation',
  Extension = 'Extension',
  Token = 'Token',
  OneTxPayment = 'OneTxPayment',
}

interface ColonyEventListener extends BaseEventListener {
  type: EventListenerType.Colony;
  address: string;
}

interface NetworkEventListener extends BaseEventListener {
  type: EventListenerType.Network;
  address: string;
}

interface VotingReputationEventListener extends BaseEventListener {
  type: EventListenerType.VotingReputation;
  address: string;
  colonyAddress: string;
}

interface OneTxPaymentEventListener extends BaseEventListener {
  type: EventListenerType.OneTxPayment;
  address: string;
  colonyAddress: string;
}

// Special listener just for Token transfers
// Due to the volume of these events, we can't process them in the same way
// as the normal events
interface TokenTransferEventListener extends BaseEventListener {
  type: EventListenerType.Token;
}

interface TokenEventListener extends BaseEventListener {
  type: EventListenerType.Token;
  address: string;
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
  | TokenTransferEventListener
  | ExtensionEventListener
  | VotingReputationEventListener
  | OneTxPaymentEventListener;
