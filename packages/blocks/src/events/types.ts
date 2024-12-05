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
 * All contract events signatures we deal with
 */
export enum ContractEventsSignatures {
  UnknownEvent = 'UnknownEvent()',
  ColonyAdded = 'ColonyAdded(uint256,address,address)',
  ColonyFundsClaimed = 'ColonyFundsClaimed(address,address,uint256,uint256)',
  ColonyVersionAdded = 'ColonyVersionAdded(uint256,address)',
  ColonyUpgraded = 'ColonyUpgraded(address,uint256,uint256)',
  NetworkFeeInverseSet = 'NetworkFeeInverseSet(uint256)',
  FundingPotAdded = 'FundingPotAdded(uint256)',

  // Tokens
  Transfer = 'Transfer(address,address,uint256)',
  LogSetAuthority = 'LogSetAuthority(address)',
  LogSetOwner = 'LogSetOwner(address)',

  // Extensions
  ExtensionAddedToNetwork = 'ExtensionAddedToNetwork(bytes32,uint256)',
  ExtensionInstalled = 'ExtensionInstalled(bytes32,address,uint256)',
  ExtensionUninstalled = 'ExtensionUninstalled(bytes32,address)',
  ExtensionDeprecated = 'ExtensionDeprecated(bytes32,address,bool)',
  ExtensionUpgraded = 'ExtensionUpgraded(bytes32,address,uint256)',
  ExtensionInitialised = 'ExtensionInitialised()',

  // Actions
  TokensMinted = 'TokensMinted(address,address,uint256)',
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
  ArbitraryTransaction = 'ArbitraryTransaction(address,bytes,bool)',

  // Motions
  MotionCreated = 'MotionCreated(uint256,address,uint256)',
  MotionStaked = 'MotionStaked(uint256,address,uint256,uint256)',
  MotionFinalized = 'MotionFinalized(uint256,bytes,bool)',
  MotionRewardClaimed = 'MotionRewardClaimed(uint256,address,uint256,uint256)',
  MotionVoteSubmitted = 'MotionVoteSubmitted(uint256,address)',
  MotionVoteRevealed = 'MotionVoteRevealed(uint256,address,uint256)',
  MotionEventSet = 'MotionEventSet(uint256,uint256)',

  // Multisig
  MultisigRoleSet = 'MultisigRoleSet(address,address,uint256,uint256,bool)',
  MultisigMotionExecuted = 'MotionExecuted(address,uint256,bool)',
  MultisigMotionCancelled = 'MotionCancelled(address,uint256)',
  MultisigMotionCreated = 'MotionCreated(address,uint256)',
  MultisigApprovalChanged = 'ApprovalChanged(address,uint256,uint8,bool)',
  MultisigRejectionChanged = 'RejectionChanged(address,uint256,uint8,bool)',
  MultisigGlobalThresholdSet = 'GlobalThresholdSet(uint256)',
  MultisigDomainSkillThresholdSet = 'DomainSkillThresholdSet(uint256,uint256)',

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
  ExpenditureStateChanged = 'ExpenditureStateChanged(address,uint256,uint256,bool[],bytes32[],bytes32)',

  // Staked Expenditures
  StakeReclaimed = 'StakeReclaimed(uint256)',
  ExpenditureStakerPunished = 'ExpenditureStakerPunished(address,uint256,bool)',
  ExpenditureMadeViaStake = 'ExpenditureMadeViaStake(address,uint256,uint256)',
  StakeFractionSet = 'StakeFractionSet(address,uint256)',

  // Staged Expenditures
  ExpenditureMadeStaged = 'ExpenditureMadeStaged(address,uint256,bool)',
  StagedPaymentReleased = 'StagedPaymentReleased(address,uint256,uint256)',

  // Streaming Payments
  StreamingPaymentCreated = 'StreamingPaymentCreated(address,uint256)',
  PaymentTokenUpdated = 'PaymentTokenUpdated(address,uint256,address,uint256)',

  // Annotations
  AnnotateTransaction = 'Annotation(address,bytes32,string)',

  // Reputation
  ReputationMiningCycleComplete = 'ReputationMiningCycleComplete(bytes32,uint256)',
  // Metadata delta
  ColonyMetadataDelta = 'ColonyMetadataDelta(address,string)',
  // Proxy colonies
  ProxyColonyRequested = 'ProxyColonyRequested(uint256,bytes32)',
  ProxyColonyDeployed = 'ProxyColonyDeployed(address)',
  LogMessagePublished = 'LogMessagePublished(address,uint64,uint32,bytes,uint8)',
  WormholeMessageReceived = 'WormholeMessageReceived(uint16,bytes32,uint64)',
}

/*
 * The internal Ethers event names for which we can set listeners
 * (Which for some reason Ethers doesn't export the types for)
 */
export enum EthersObserverEvents {
  Block = 'block',
}

export type EventHandler = (
  event: ContractEvent,
  listener: EventListener,
) => Promise<void>;

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
  Extension = 'Extension',
  Token = 'Token',
  MultisigPermissions = 'MultisigPermissions',
  ProxyColonies = 'ProxyColonies',
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

export interface ProxyColoniesListener extends BaseEventListener {
  type: EventListenerType.ProxyColonies;
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
  | ProxyColoniesListener
  | ExtensionEventListener;
