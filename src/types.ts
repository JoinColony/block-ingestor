import { LogDescription } from '@ethersproject/abi';

/*
 * Custom contract event, since we need some log values as well
 */
export interface ContractEvent extends LogDescription {
  transactionHash: string;
  logIndex: number;
  contractAddress: string;
  blockNumber: number;
}

/*
 * Event names used for our internal Events Queue System
 */
export enum QueueEvents {
  NewEvent = 'NewEvent',
  QueueUpdated = 'QueueUpdated',
  ProcessEvents = 'ProcessEvents', // start processing events in queue
  ProcessEvent = 'ProcessEvent', // process a individual event
  EventProcessed = 'EventProcessed',
}

/*
 * All contract events signatures we deal with
 */
export enum ContractEventsSignatures {
  UknownEvent = 'UknownEvent()',
  ColonyAdded = 'ColonyAdded(uint256,address,address)',
  Transfer = 'Transfer(address,address,uint256)',
  ColonyFundsClaimed = 'ColonyFundsClaimed(address,address,uint256,uint256)',
  ExtensionAddedToNetwork = 'ExtensionAddedToNetwork(bytes32,uint256)',
  ExtensionInstalled = 'ExtensionInstalled(bytes32,address,uint256)',
  ExtensionUninstalled = 'ExtensionUninstalled(bytes32,address)',
  ExtensionDeprecated = 'ExtensionDeprecated(bytes32,address,bool)',
  ExtensionUpgraded = 'ExtensionUpgraded(indexed bytes32,indexed address,uint256)',
}

/*
 * The internal Ethers event names for which we can set listeners
 * (Which for some reason Ethers doesn't export the types for)
 */
export enum EthersObserverEvents {
  Block = 'block',
}

export type ChainID = number;
