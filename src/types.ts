import { LogDescription } from '@ethersproject/abi';
import { ClientType } from '@colony/colony-js';

export interface ContractEvent extends LogDescription {
  transactionHash: string
  logIndex: number
  contractAddress: string
}

export enum QueueEvents {
  NewEvent = 'NewEvent',
  QueueUpdated = 'QueueUpdated',
  ProcessEvents = 'ProcessEvents', // start processing events in queue
  ProcessEvent = 'ProcessEvent', // process a individual event
  EventProcessed = 'EventProcessed',
};

export enum ContractEventsSignatures {
  UknownEvent = 'UknownEvent()',
  ColonyAdded = 'ColonyAdded(uint256,address,address)',
  Transfer = 'Transfer(address,address,uint256)',
  ColonyFundsClaimed = 'ColonyFundsClaimed(address,address,uint256,uint256)',
}

export enum SortOrder {
  Asc = 'ascending',
  Desc = 'descending',
}

export enum EthersObserverEvents {
  Block = 'block',
}

/*
 * Sort priority for events
 *
 * If negative priority, it will be relegated to the back of the array
 * If not listed it will be sorted after the ones with priority set, and
 * before the ones with negative priority
 */
export const contractEventsPriorityMap = {
  [ContractEventsSignatures.Transfer]: 2,
  [ContractEventsSignatures.ColonyFundsClaimed]: 3,
  [ContractEventsSignatures.UknownEvent]: -1,
};

/*
 * Which event should be handled with which colonyJS client type
 */
export const contractEvetsToClientMap = {
  [ContractEventsSignatures.UknownEvent]: ClientType.NetworkClient,
  [ContractEventsSignatures.ColonyAdded]: ClientType.NetworkClient,
  [ContractEventsSignatures.Transfer]: ClientType.TokenClient,
  [ContractEventsSignatures.ColonyFundsClaimed]: ClientType.ColonyClient,
};
