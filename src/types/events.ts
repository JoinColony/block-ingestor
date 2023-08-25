import {
  AnyColonyClient,
  AnyVotingReputationClient,
  ColonyNetworkClient,
  TokenClient,
} from '@colony/colony-js';
import { LogDescription } from '@ethersproject/abi';
import provider from '~provider';

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
  // Optional property that will be set if the event is emitted by an extension
  colonyAddress?: string;
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
  FundingPotAdded = 'FundingPotAdded(uint256)',

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

  // Expenditures
  ExpenditureGlobalClaimDelaySet = 'ExpenditureGlobalClaimDelaySet(address,uint256)',
  ExpenditureClaimDelaySet = 'ExpenditureClaimDelaySet(address,uint256,uint256,uint256)',
  ExpenditureAdded = 'ExpenditureAdded(address,uint256)',
  ExpenditureTransferred = 'ExpenditureTransferred(address,uint256,address)',
  ExpenditureCancelled = 'ExpenditureCancelled(address,uint256)',
  ExpenditureLocked = 'ExpenditureLocked(address,uint256)',
  ExpenditureFinalized = 'ExpenditureFinalized(address,uint256)',
  ExpenditureRecipientSet = 'ExpenditureRecipientSet(address,uint256,uint256,address)',
  ExpenditurePayoutSet = 'ExpenditurePayoutSet(address,uint256,uint256,address,uint256)',
  ExpenditurePayoutModifierSet = 'ExpenditurePayoutModifierSet(address,uint256,uint256,int256)',
  ExpenditurePayoutClaimed = 'PayoutClaimed(address,uint256,uint256,address,uint256)',

  // Annotations
  AnnotateTransaction = 'Annotation(address,bytes32,string)',
}

/*
 * The internal Ethers event names for which we can set listeners
 * (Which for some reason Ethers doesn't export the types for)
 */
export enum EthersObserverEvents {
  Block = 'block',
}

export type ChainID = number;

export type Block = Awaited<ReturnType<typeof provider.getBlock>>;

export type NetworkClients =
  | ColonyNetworkClient
  | TokenClient
  | AnyColonyClient
  | AnyVotingReputationClient;
