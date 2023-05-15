import {
  AnyColonyClient,
  AnyOneTxPaymentClient,
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

/*
 * GraphQL ColonyActionType enum
 */
export enum ColonyActionType {
  MintTokens = 'MINT_TOKENS',
  Payment = 'PAYMENT',
  CreateDomain = 'CREATE_DOMAIN',
  EditDomain = 'EDIT_DOMAIN',
  UnlockToken = 'UNLOCK_TOKEN',
  MoveFunds = 'MOVE_FUNDS',
  ColonyEdit = 'COLONY_EDIT',
  VersionUpgrade = 'VERSION_UPGRADE',
  EmitDomainReputationPenalty = 'EMIT_DOMAIN_REPUTATION_PENALTY',
  EmitDomainReputationReward = 'EMIT_DOMAIN_REPUTATION_REWARD',
  MintTokensMotion = 'MINT_TOKENS_MOTION',
  CreateDomainMotion = 'CREATE_DOMAIN_MOTION',
  EditDomainMotion = 'EDIT_DOMAIN_MOTION',
  VersionUpgradeMotion = 'VERSION_UPGRADE_MOTION',
  UnlockTokenMotion = 'UNLOCK_TOKEN_MOTION',
  PaymentMotion = 'PAYMENT_MOTION',
  MoveFundsMotion = 'MOVE_FUNDS_MOTION',
  EmitDomainReputationPenaltyMotion = 'EMIT_DOMAIN_REPUTATION_PENALTY_MOTION',
  EmitDomainReputationRewardMotion = 'EMIT_DOMAIN_REPUTATION_REWARD_MOTION',
  ColonyEditMotion = 'COLONY_EDIT_MOTION',
}

export type ColonyActionHandler = (event: ContractEvent) => Promise<void>;

// The Filter type doesn't seem to be exported from colony-js
export type Filter = Parameters<typeof getLogs>[1];

// Export here to avoid circular dependency with ColonyActionType
export * from './motions';

export * from './actions';

export type NetworkClients =
  | ColonyNetworkClient
  | TokenClient
  | AnyColonyClient
  | AnyVotingReputationClient
  | AnyOneTxPaymentClient;

export interface ExtensionParams {
  votingReputation?: VotingReputationParams;
}

interface VotingReputationParams {
  totalStakeFraction: string;
  voterRewardFraction: string;
  userMinStakeFraction: string;
  maxVoteFraction: string;
  stakePeriod: string;
  submitPeriod: string;
  revealPeriod: string;
  escalationPeriod: string;
}

export interface ColonyQuery {
  colonyAddress: string;
  tokens:
    | {
        items: Array<{
          id: string;
          tokenAddress: string;
        } | null>;
      }
    | null
    | undefined;
}
