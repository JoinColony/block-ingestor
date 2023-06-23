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

interface VotingReputationEventListener extends BaseEventListener {
  type: EventListenerType.VotingReputation;
  address: string;
  colonyAddress: string;
}

interface TokenEventListener extends BaseEventListener {
  type: EventListenerType.Token;
}

export type EventListener =
  | ColonyEventListener
  | NetworkEventListener
  | VotingReputationEventListener
  | TokenEventListener;
