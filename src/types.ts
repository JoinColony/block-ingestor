export interface QueueEvent {
  name: ContractEventsSignatures
};

export enum QueueEvents {
  NewEvent = 'NewEvent',
  QueueUpdated = 'QueueUpdated',
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
