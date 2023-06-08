import {
  AnyColonyClient,
  AnyVotingReputationClient,
  ColonyNetworkClient,
  TokenClient,
  getLogs,
} from '@colony/colony-js';
import { LogDescription } from '@ethersproject/abi';

/*
 * Custom contract event, since we need some log values as well
 */
export interface ContractEvent extends LogDescription {
  transactionHash: string;
  logIndex: number;
  contractAddress: string;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
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
  UnknownEvent = 'UnknownEvent()',
  ColonyAdded = 'ColonyAdded(uint256,address,address)',
  Transfer = 'Transfer(address,address,uint256)',
  ColonyFundsClaimed = 'ColonyFundsClaimed(address,address,uint256,uint256)',
  ColonyVersionAdded = 'ColonyVersionAdded(uint256,address)',
  ColonyUpgraded = 'ColonyUpgraded(address,uint256,uint256)',
  NetworkFeeInverseSet = 'NetworkFeeInverseSet(uint256)',

  // Extensions
  ExtensionAddedToNetwork = 'ExtensionAddedToNetwork(bytes32,uint256)',
  ExtensionInstalled = 'ExtensionInstalled(bytes32,address,uint256)',
  ExtensionUninstalled = 'ExtensionUninstalled(bytes32,address)',
  ExtensionDeprecated = 'ExtensionDeprecated(bytes32,address,bool)',
  ExtensionUpgraded = 'ExtensionUpgraded(indexed bytes32,indexed address,uint256)',
  ExtensionInitialised = 'ExtensionInitialised()',

  // Actions
  TokensMinted = 'TokensMinted(address,address,uint256)',
  PaymentAdded = 'PaymentAdded(address,uint256)',
  PayoutClaimed = 'PayoutClaimed(address,uint256,address,uint256)',
  OneTxPaymentMade = 'OneTxPaymentMade(address,uint256,uint256)',
  DomainAdded = 'DomainAdded(address,uint256)',
  DomainMetadata = 'DomainMetadata(address,uint256,string)',
  TokenUnlocked = 'TokenUnlocked(address)',
  ColonyFundsMovedBetweenFundingPots = 'ColonyFundsMovedBetweenFundingPots(address,uint256,uint256,uint256,address)',
  ColonyMetadata = 'ColonyMetadata(address,string)',
  ArbitraryReputationUpdate = 'ArbitraryReputationUpdate(address,address,uint256,int256)',
  ColonyRoleSet = 'ColonyRoleSet(address,address,uint256,uint8,bool)',
  ColonyRoleSet_OLD = 'ColonyRoleSet(address,uint256,uint8,bool)',
  RecoveryRoleSet = 'RecoveryRoleSet(address,bool)',

  // Motions
  MotionCreated = 'MotionCreated(uint256,address,uint256)',
  MotionStaked = 'MotionStaked(uint256,address,uint256,uint256)',
  MotionFinalized = 'MotionFinalized(uint256,bytes,bool)',
  MotionRewardClaimed = 'MotionRewardClaimed(uint256,address,uint256,uint256)',
  MotionVoteSubmitted = 'MotionVoteSubmitted(uint256,address)',
  MotionVoteRevealed = 'MotionVoteRevealed(uint256,address,uint256)',
}

/*
 * The internal Ethers event names for which we can set listeners
 * (Which for some reason Ethers doesn't export the types for)
 */
export enum EthersObserverEvents {
  Block = 'block',
}

export type ChainID = number;

// The Filter type doesn't seem to be exported from colony-js
export type Filter = Parameters<typeof getLogs>[1];

export type NetworkClients =
  | ColonyNetworkClient
  | TokenClient
  | AnyColonyClient
  | AnyVotingReputationClient;
