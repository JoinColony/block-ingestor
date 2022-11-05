interface ContractEventArguments {
  colonyAddress?: string
  token?: string
}

export interface ContractEvent {
  name: string
  signature: ContractEventsSignatures
  args?: ContractEventArguments
};

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
  NativeTokenTransfer = 'NativeTokenTransfer()',
}

export enum SortOrder {
  Asc = 'ascending',
  Desc = 'descending',
}
