import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: any;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: number;
  AWSURL: string;
};

/** Defines an annotation for actions, motions and decisions */
export type Annotation = {
  __typename?: 'Annotation';
  /** The id of the action it annotates */
  actionId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** The id of the annotation. */
  id: Scalars['ID'];
  /** The IPFS hash, if the annotation was also uploaded to IPFS */
  ipfsHash?: Maybe<Scalars['String']>;
  /** The actual annotation message */
  message: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Token IDs */
export type ApprovedTokenChanges = {
  __typename?: 'ApprovedTokenChanges';
  added: Array<Scalars['ID']>;
  removed: Array<Scalars['ID']>;
  unaffected: Array<Scalars['ID']>;
};

export type ApprovedTokenChangesInput = {
  added: Array<Scalars['ID']>;
  removed: Array<Scalars['ID']>;
  unaffected: Array<Scalars['ID']>;
};

export type ArbitraryTxAbi = {
  __typename?: 'ArbitraryTxAbi';
  contractAddress: Scalars['String'];
  jsonAbi: Scalars['String'];
};

export type ArbitraryTxAbiInput = {
  contractAddress: Scalars['String'];
  jsonAbi: Scalars['String'];
};

export type BridgeBankAccount = {
  __typename?: 'BridgeBankAccount';
  accountOwner: Scalars['String'];
  bankName: Scalars['String'];
  currency: Scalars['String'];
  iban?: Maybe<BridgeIbanBankAccount>;
  id: Scalars['String'];
  usAccount?: Maybe<BridgeUsBankAccount>;
};

export type BridgeCheckKycReturn = {
  __typename?: 'BridgeCheckKYCReturn';
  bankAccount?: Maybe<BridgeBankAccount>;
  kycLink?: Maybe<Scalars['String']>;
  kycStatus?: Maybe<KycStatus>;
  liquidationAddress?: Maybe<Scalars['String']>;
  tosLink?: Maybe<Scalars['String']>;
};

export type BridgeCreateBankAccountInput = {
  accountOwner: Scalars['String'];
  address?: InputMaybe<BridgeXyzMutationAddressInput>;
  bankName: Scalars['String'];
  currency: Scalars['String'];
  iban?: InputMaybe<BridgeIbanAccountInput>;
  usAccount?: InputMaybe<BridgeUsAccountInput>;
};

export type BridgeCreateBankAccountReturn = {
  __typename?: 'BridgeCreateBankAccountReturn';
  success?: Maybe<Scalars['Boolean']>;
};

export type BridgeDrain = {
  __typename?: 'BridgeDrain';
  amount: Scalars['String'];
  createdAt: Scalars['String'];
  currency: Scalars['String'];
  id: Scalars['String'];
  receipt?: Maybe<BridgeDrainReceipt>;
  state: Scalars['String'];
};

export type BridgeDrainReceipt = {
  __typename?: 'BridgeDrainReceipt';
  url: Scalars['String'];
};

export type BridgeGatewayFeeReturn = {
  __typename?: 'BridgeGatewayFeeReturn';
  success?: Maybe<Scalars['Boolean']>;
  transactionFeePercentage?: Maybe<Scalars['Float']>;
};

export type BridgeIbanAccountInput = {
  account_number: Scalars['String'];
  bic: Scalars['String'];
  country: Scalars['String'];
};

export type BridgeIbanBankAccount = {
  __typename?: 'BridgeIbanBankAccount';
  bic: Scalars['String'];
  country: Scalars['String'];
  id: Scalars['String'];
  last4: Scalars['String'];
};

export type BridgeUpdateBankAccountInput = {
  account: BridgeCreateBankAccountInput;
  id: Scalars['String'];
};

export type BridgeUpdateBankAccountReturn = {
  __typename?: 'BridgeUpdateBankAccountReturn';
  success?: Maybe<Scalars['Boolean']>;
};

export type BridgeUsAccountInput = {
  account_number: Scalars['String'];
  routing_number: Scalars['String'];
};

export type BridgeUsBankAccount = {
  __typename?: 'BridgeUsBankAccount';
  last4: Scalars['String'];
  routingNumber: Scalars['String'];
};

export type BridgeXyzMutationAccountInput = {
  account_number: Scalars['String'];
  routing_number: Scalars['String'];
};

export type BridgeXyzMutationAddressInput = {
  city: Scalars['String'];
  country: Scalars['String'];
  postal_code?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  street_line_1: Scalars['String'];
  street_line_2?: InputMaybe<Scalars['String']>;
};

export type BridgeXyzMutationBodyInput = {
  account?: InputMaybe<BridgeXyzMutationAccountInput>;
  address?: InputMaybe<BridgeXyzMutationAddressInput>;
  bank_name?: InputMaybe<Scalars['String']>;
  birth_date?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  full_name?: InputMaybe<Scalars['String']>;
  iban?: InputMaybe<BridgeXyzMutationIbanInput>;
  last_name?: InputMaybe<Scalars['String']>;
  signed_agreement_id?: InputMaybe<Scalars['String']>;
  tax_identification_number?: InputMaybe<Scalars['String']>;
};

export type BridgeXyzMutationIbanInput = {
  account_number: Scalars['String'];
  bic: Scalars['String'];
  country: Scalars['String'];
};

export type BridgeXyzMutationInput = {
  body: BridgeXyzMutationBodyInput;
  path: Scalars['String'];
};

export type BridgeXyzMutationReturn = {
  __typename?: 'BridgeXYZMutationReturn';
  kyc_link?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
  tos_link?: Maybe<Scalars['String']>;
};

/** Return type for cache all domain balance */
export type CacheAllDomainBalanceReturn = {
  __typename?: 'CacheAllDomainBalanceReturn';
  success: Scalars['Boolean'];
};

/** Represents a table for caching the total balance */
export type CacheTotalBalance = {
  __typename?: 'CacheTotalBalance';
  /** Address of the colony on the blockchain */
  colonyAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** Request timestamp */
  date: Scalars['AWSDateTime'];
  /** Domain id within a colony */
  domainId?: Maybe<Scalars['String']>;
  /** Unique identifier */
  id: Scalars['ID'];
  /** The timeframe period for which we want to cache the in/out token balance */
  timeframePeriod: Scalars['Int'];
  /**
   * The timeframe type (day/week/month) for which we want to cache the in/out token balance
   * Defaults to TimeframeType.DAILY
   */
  timeframeType: TimeframeType;
  /** The total balance (totalIn - totalOut) in USDC */
  totalUSDC?: Maybe<Scalars['String']>;
  /** The total in balance in USDC */
  totalUSDCIn?: Maybe<Scalars['String']>;
  /** The total out balance in USDC */
  totalUSDCOut?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
};

/**
 * Represents metadata related to a blockchain event
 * Applies to Colonies, Tokens and Events, but not all fields are revlant to all
 * It does not apply to user accounts as they can live on all networks
 */
export type ChainMetadata = {
  __typename?: 'ChainMetadata';
  /** The block number of the event */
  blockNumber?: Maybe<Scalars['Int']>;
  /** The chain ID of the event */
  chainId: Scalars['String'];
  /** The log index of the event */
  logIndex?: Maybe<Scalars['Int']>;
  /** The network the event occurred on */
  network?: Maybe<Network>;
  /** The transaction hash of the event */
  transactionHash?: Maybe<Scalars['String']>;
};

export type ChainMetadataInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  chainId: Scalars['String'];
  logIndex?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
  transactionHash?: InputMaybe<Scalars['String']>;
};

export enum ClientType {
  CoinMachineClient = 'CoinMachineClient',
  ColonyClient = 'ColonyClient',
  EvaluatedExpenditureClient = 'EvaluatedExpenditureClient',
  FundingQueueClient = 'FundingQueueClient',
  LightTokenClient = 'LightTokenClient',
  MotionTargetClient = 'MotionTargetClient',
  MultisigPermissionsClient = 'MultisigPermissionsClient',
  NetworkClient = 'NetworkClient',
  OneTxPaymentClient = 'OneTxPaymentClient',
  ReputationBootstrapperClient = 'ReputationBootstrapperClient',
  StagedExpenditureClient = 'StagedExpenditureClient',
  StakedExpenditureClient = 'StakedExpenditureClient',
  StreamingPaymentsClient = 'StreamingPaymentsClient',
  TokenClient = 'TokenClient',
  TokenLockingClient = 'TokenLockingClient',
  TokenSupplierClient = 'TokenSupplierClient',
  VotingReputationClient = 'VotingReputationClient',
  WhitelistClient = 'WhitelistClient',
}

/** Represents a Colony within the Colony Network */
export type Colony = {
  __typename?: 'Colony';
  actions?: Maybe<ModelColonyActionConnection>;
  /** Returns a list token balances for each domain and each token that the colony has */
  balances?: Maybe<ColonyBalances>;
  /**
   * Native chain token claim (e.g., Token 0x0000...0000: ETH, xDAI, etc.)
   * This is not an array since only a single token type can be returned
   */
  chainFundsClaim?: Maybe<ColonyChainFundsClaim>;
  /** Metadata related to the chain of the Colony */
  chainMetadata: ChainMetadata;
  /**
   * The main member invite object
   * It is possible to create multiple member invites for a given colony
   * but only one of them is considered the `main` one
   */
  colonyMemberInvite?: Maybe<ColonyMemberInvite>;
  /** ID of the main member invite object */
  colonyMemberInviteCode?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  /** The block number the colony was created attached */
  createdAtBlock?: Maybe<Scalars['Int']>;
  domains?: Maybe<ModelDomainConnection>;
  expenditures?: Maybe<ModelExpenditureConnection>;
  /** Global claim delay for expenditures (in seconds) */
  expendituresGlobalClaimDelay?: Maybe<Scalars['String']>;
  extensions?: Maybe<ModelColonyExtensionConnection>;
  fundsClaimData?: Maybe<ModelColonyFundsClaimConnection>;
  /** Unique identifier for the Colony (contract address) */
  id: Scalars['ID'];
  /** Time at which the contributors with reputation in the colony were last updated */
  lastUpdatedContributorsWithReputation?: Maybe<Scalars['AWSDateTime']>;
  /** Metadata of the Colony */
  metadata?: Maybe<ColonyMetadata>;
  /** List of motions within the Colony that have unclaimed stakes */
  motionsWithUnclaimedStakes?: Maybe<Array<ColonyUnclaimedStake>>;
  /** (Short) name of the Colony */
  name: Scalars['String'];
  /** The native token of the Colony */
  nativeToken: Token;
  /** The unique address of the native token of the Colony */
  nativeTokenId: Scalars['ID'];
  /** A flag to indicate whether the colony is private */
  private?: Maybe<Scalars['Boolean']>;
  /** The total reputation amount in the colony */
  reputation?: Maybe<Scalars['String']>;
  roles?: Maybe<ModelColonyRoleConnection>;
  /** Status information for the Colony */
  status?: Maybe<ColonyStatus>;
  tokens?: Maybe<ModelColonyTokensConnection>;
  /** Type of the Colony (Regular or Metacolony) */
  type?: Maybe<ColonyType>;
  updatedAt: Scalars['AWSDateTime'];
  /** Version of the Colony */
  version: Scalars['Int'];
};

/** Represents a Colony within the Colony Network */
export type ColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Colony within the Colony Network */
export type ColonyDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<ModelIntKeyConditionInput>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Colony within the Colony Network */
export type ColonyExpendituresArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Colony within the Colony Network */
export type ColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Colony within the Colony Network */
export type ColonyFundsClaimDataArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Colony within the Colony Network */
export type ColonyRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Colony within the Colony Network */
export type ColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents an action performed within a Colony */
export type ColonyAction = {
  __typename?: 'ColonyAction';
  /**
   * The amount involved in the action, if applicable
   * In any case where network fee is involved, this amount excludes it
   */
  amount?: Maybe<Scalars['String']>;
  /** The annotation associated with the action, if there is one */
  annotation?: Maybe<Annotation>;
  /** The id of the associated annotation, if there is one */
  annotationId?: Maybe<Scalars['ID']>;
  /** Approved tokens impacted by the action (used for manage tokens) */
  approvedTokenChanges?: Maybe<ApprovedTokenChanges>;
  arbitraryTransactions?: Maybe<Array<ColonyActionArbitraryTransaction>>;
  /** The block number where the action was recorded */
  blockNumber: Scalars['Int'];
  /** The Colony that the action belongs to */
  colony: Colony;
  colonyActionsId?: Maybe<Scalars['ID']>;
  /** If the action is a Simple Decision, it will have an id that corresponds to a ColonyDecision entry in the database. */
  colonyDecisionId?: Maybe<Scalars['ID']>;
  /** The identifier of the Colony that the action belongs to */
  colonyId: Scalars['ID'];
  /** The timestamp when the action was created */
  createdAt: Scalars['AWSDateTime'];
  /** Corresponding Decision data, if action is a Simple Decision */
  decisionData?: Maybe<ColonyDecision>;
  /** Expenditure associated with the action, if any */
  expenditure?: Maybe<Expenditure>;
  /** ID of the associated expenditure, if any */
  expenditureId?: Maybe<Scalars['ID']>;
  /**
   * Changes to the expenditure slots associated with the action, if any
   * Applicable to `EDIT_EXPENDITURE` action only
   */
  expenditureSlotChanges?: Maybe<ExpenditureSlotChanges>;
  /** Ids of the staged payment slots released by the action, if any */
  expenditureSlotIds?: Maybe<Array<Scalars['Int']>>;
  /** The source Domain of the action, if applicable */
  fromDomain?: Maybe<Domain>;
  /** The source Domain identifier, if applicable */
  fromDomainId?: Maybe<Scalars['ID']>;
  /** The native ID of the source funding pot, only applicable for MOVE_FUNDS action */
  fromPotId?: Maybe<Scalars['Int']>;
  /** Unique identifier for the ColonyAction */
  id: Scalars['ID'];
  /** JSON string to pass custom, dynamic event data */
  individualEvents?: Maybe<Scalars['String']>;
  /** The Ethereum address of the action initiator. Can be a user, extension or colony */
  initiatorAddress: Scalars['ID'];
  /** The Colony that initiated the action, if applicable */
  initiatorColony?: Maybe<Colony>;
  /** The ColonyExtension that initiated the action, if applicable */
  initiatorExtension?: Maybe<ColonyExtension>;
  /** The Token contract that initiated the action, if applicable */
  initiatorToken?: Maybe<Token>;
  /** The User who initiated the action, if applicable */
  initiatorUser?: Maybe<User>;
  /** Will be true if the action is a motion */
  isMotion?: Maybe<Scalars['Boolean']>;
  /**
   * Indicates whether the action is a result of a motion being finalized
   * @TODO: Make this field non-nullable
   */
  isMotionFinalization?: Maybe<Scalars['Boolean']>;
  /** Will be true if the action is a multiSig motion */
  isMultiSig?: Maybe<Scalars['Boolean']>;
  /** Members impacted by the action (used for add/remove verified members) */
  members?: Maybe<Array<Scalars['ID']>>;
  /** Metadata associated with the action (Eg. Custom action title) */
  metadata?: Maybe<ColonyActionMetadata>;
  /** Expanded `ColonyMotion` for the corresponding `motionId` */
  motionData?: Maybe<ColonyMotion>;
  /** Corresponding domainId of the motion */
  motionDomainId?: Maybe<Scalars['Int']>;
  /** The internal database id of the motion */
  motionId?: Maybe<Scalars['ID']>;
  /** Expanded `ColonyMultiSig` for the corresponding `multiSigId` */
  multiSigData?: Maybe<ColonyMultiSig>;
  /** The internal database id of the multiSig */
  multiSigId?: Maybe<Scalars['ID']>;
  /** The network fee amount, if applicable */
  networkFee?: Maybe<Scalars['String']>;
  /** The resulting new Colony version, if applicable */
  newColonyVersion?: Maybe<Scalars['Int']>;
  /** The native id of the payment */
  paymentId?: Maybe<Scalars['Int']>;
  /** Payment data for multiple OneTxPayments */
  payments?: Maybe<Array<Payment>>;
  /** Colony metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingColonyMetadata?: Maybe<ColonyMetadata>;
  /** Identifier of Colony metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingColonyMetadataId?: Maybe<Scalars['ID']>;
  /** Domain metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingDomainMetadata?: Maybe<DomainMetadata>;
  /** Identifier of domain metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingDomainMetadataId?: Maybe<Scalars['ID']>;
  /** The address of the action recipient, if applicable */
  recipientAddress?: Maybe<Scalars['ID']>;
  /** The corresponding Colony which was involved the action, if applicable */
  recipientColony?: Maybe<Colony>;
  /** The corresponding extension which was involved the action, if applicable */
  recipientExtension?: Maybe<ColonyExtension>;
  /** The address of the token that was received the action, if applicable */
  recipientToken?: Maybe<Token>;
  /** The User who received the action, if applicable */
  recipientUser?: Maybe<User>;
  /** Colony roles that are associated with the action */
  roles?: Maybe<ColonyActionRoles>;
  /** Colony roles that are associated with the action are multi sig roles */
  rolesAreMultiSig?: Maybe<Scalars['Boolean']>;
  /** The reputation root hash at the time of the creation of the action */
  rootHash: Scalars['String'];
  /** Safe transactions associated with the action */
  safeTransaction?: Maybe<SafeTransaction>;
  /**
   * Whether to show the motion in the actions list
   * True for (forced) actions. True for motions if staked above 10%
   * @TODO: Refactor this into more granular fields for better searchability
   * Currently it is impossible to tell the reason for the action being hidden from the actions list
   */
  showInActionsList: Scalars['Boolean'];
  /** The target Domain of the action, if applicable */
  toDomain?: Maybe<Domain>;
  /** The target Domain identifier, if applicable */
  toDomainId?: Maybe<Scalars['ID']>;
  /** The native ID of the target funding pot, only applicable for MOVE_FUNDS action */
  toPotId?: Maybe<Scalars['Int']>;
  /** The Token involved in the action, if applicable */
  token?: Maybe<Token>;
  /** The Ethereum address of the token involved in the action, if applicable */
  tokenAddress?: Maybe<Scalars['ID']>;
  /** The type of action performed */
  type: ColonyActionType;
  updatedAt: Scalars['AWSDateTime'];
};

/** Colony Arbitrary transaction that can be involved in an action */
export type ColonyActionArbitraryTransaction = {
  __typename?: 'ColonyActionArbitraryTransaction';
  contractAddress: Scalars['String'];
  encodedFunction: Scalars['String'];
};

export type ColonyActionArbitraryTransactionInput = {
  contractAddress: Scalars['String'];
  encodedFunction: Scalars['String'];
};

export type ColonyActionMetadata = {
  __typename?: 'ColonyActionMetadata';
  /** In case of arbitrary transaction actions, stores the array of ABIs used to encode the transactions */
  arbitraryTxAbis?: Maybe<Array<ArbitraryTxAbi>>;
  createdAt: Scalars['AWSDateTime'];
  customTitle: Scalars['String'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Colony Roles that can be involved in an action */
export type ColonyActionRoles = {
  __typename?: 'ColonyActionRoles';
  /** Recovery role */
  role_0?: Maybe<Scalars['Boolean']>;
  /** Root role */
  role_1?: Maybe<Scalars['Boolean']>;
  /** Arbitration role */
  role_2?: Maybe<Scalars['Boolean']>;
  /** Architecture role */
  role_3?: Maybe<Scalars['Boolean']>;
  /** Funding role */
  role_5?: Maybe<Scalars['Boolean']>;
  /** Administration role */
  role_6?: Maybe<Scalars['Boolean']>;
};

export type ColonyActionRolesInput = {
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
};

/**
 * Variants of Colony Network blockchain events
 *
 * These can all happen in a Colony and will be interpreted by the dApp according to their types
 */
export enum ColonyActionType {
  /** An action related to adding verified members */
  AddVerifiedMembers = 'ADD_VERIFIED_MEMBERS',
  AddVerifiedMembersMotion = 'ADD_VERIFIED_MEMBERS_MOTION',
  AddVerifiedMembersMultisig = 'ADD_VERIFIED_MEMBERS_MULTISIG',
  /** An action related to arbitrary transaction */
  ArbitraryTx = 'ARBITRARY_TX',
  /** An action related to canceling an expenditure */
  CancelExpenditure = 'CANCEL_EXPENDITURE',
  /** An action related to a motion to cancel an expenditure */
  CancelExpenditureMotion = 'CANCEL_EXPENDITURE_MOTION',
  /** An action related to a multiSig to cancel a staked expenditure */
  CancelStakedExpenditureMultisig = 'CANCEL_STAKED_EXPENDITURE_MULTISIG',
  /** An action related to editing a Colony's details */
  ColonyEdit = 'COLONY_EDIT',
  /** An action related to editing a Colony's details via a motion */
  ColonyEditMotion = 'COLONY_EDIT_MOTION',
  /** An action related to editing a Colony's details via multiSig */
  ColonyEditMultisig = 'COLONY_EDIT_MULTISIG',
  /** An action related to a creating a Decision within a Colony via a motion */
  CreateDecisionMotion = 'CREATE_DECISION_MOTION',
  /** An action related to a creating a Decision within a Colony via multiSig */
  CreateDecisionMultisig = 'CREATE_DECISION_MULTISIG',
  /** An action related to creating a domain within a Colony */
  CreateDomain = 'CREATE_DOMAIN',
  /** An action related to creating a domain within a Colony via a motion */
  CreateDomainMotion = 'CREATE_DOMAIN_MOTION',
  /** An action related to creating a domain within a Colony via multiSig */
  CreateDomainMultisig = 'CREATE_DOMAIN_MULTISIG',
  /** An action related to creating an expenditure (advanced payment) */
  CreateExpenditure = 'CREATE_EXPENDITURE',
  /** An action related to editing a domain's details */
  EditDomain = 'EDIT_DOMAIN',
  /** An action related to editing a domain's details via a motion */
  EditDomainMotion = 'EDIT_DOMAIN_MOTION',
  /** An action related to editing a domain's details via multiSig */
  EditDomainMultisig = 'EDIT_DOMAIN_MULTISIG',
  /** An action related to editing an expenditure */
  EditExpenditure = 'EDIT_EXPENDITURE',
  /** An action related to creating a motion to edit an expenditure */
  EditExpenditureMotion = 'EDIT_EXPENDITURE_MOTION',
  /** An action related to a domain reputation penalty within a Colony (smite) */
  EmitDomainReputationPenalty = 'EMIT_DOMAIN_REPUTATION_PENALTY',
  /** An action related to a domain reputation penalty within a Colony (smite) via a motion */
  EmitDomainReputationPenaltyMotion = 'EMIT_DOMAIN_REPUTATION_PENALTY_MOTION',
  /** An action related to a domain reputation penalty within a Colony (smite) via multiSig */
  EmitDomainReputationPenaltyMultisig = 'EMIT_DOMAIN_REPUTATION_PENALTY_MULTISIG',
  /** An action related to a domain reputation reward within a Colony */
  EmitDomainReputationReward = 'EMIT_DOMAIN_REPUTATION_REWARD',
  /** An action related to a domain reputation reward within a Colony via a motion */
  EmitDomainReputationRewardMotion = 'EMIT_DOMAIN_REPUTATION_REWARD_MOTION',
  /** An action related to a domain reputation reward within a Colony via multiSig */
  EmitDomainReputationRewardMultisig = 'EMIT_DOMAIN_REPUTATION_REWARD_MULTISIG',
  /** An action related to finalizing an expenditure */
  FinalizeExpenditure = 'FINALIZE_EXPENDITURE',
  /** An action related to finalizing an expenditure via a motion */
  FinalizeExpenditureMotion = 'FINALIZE_EXPENDITURE_MOTION',
  /** An action related to creating a motion for funding an expenditure */
  FundExpenditureMotion = 'FUND_EXPENDITURE_MOTION',
  /** An action related to creating a multiSig for funding an expenditure */
  FundExpenditureMultisig = 'FUND_EXPENDITURE_MULTISIG',
  /** A generic or unspecified Colony action */
  Generic = 'GENERIC',
  /** An action related to locking an expenditure */
  LockExpenditure = 'LOCK_EXPENDITURE',
  /** An action related to the creation of safe transactions via Safe Control */
  MakeArbitraryTransaction = 'MAKE_ARBITRARY_TRANSACTION',
  MakeArbitraryTransactionsMotion = 'MAKE_ARBITRARY_TRANSACTIONS_MOTION',
  MakeArbitraryTransactionsMultisig = 'MAKE_ARBITRARY_TRANSACTIONS_MULTISIG',
  /** An action related to adding / removing approved colony tokens */
  ManageTokens = 'MANAGE_TOKENS',
  ManageTokensMotion = 'MANAGE_TOKENS_MOTION',
  ManageTokensMultisig = 'MANAGE_TOKENS_MULTISIG',
  /** An action related to minting tokens within a Colony */
  MintTokens = 'MINT_TOKENS',
  /** An action related to minting tokens within a Colony via a motion */
  MintTokensMotion = 'MINT_TOKENS_MOTION',
  /** An action related to minting tokens within a Colony via multiSig */
  MintTokensMultisig = 'MINT_TOKENS_MULTISIG',
  /** An action related to moving funds between domains */
  MoveFunds = 'MOVE_FUNDS',
  /** An action related to moving funds between domains via a motion */
  MoveFundsMotion = 'MOVE_FUNDS_MOTION',
  /** An action related to moving funds between domains via multiSig */
  MoveFundsMultisig = 'MOVE_FUNDS_MULTISIG',
  /** An action related to making multiple payments within a Colony */
  MultiplePayment = 'MULTIPLE_PAYMENT',
  /** An action related to making multiple payments within a Colony */
  MultiplePaymentMotion = 'MULTIPLE_PAYMENT_MOTION',
  /** A multiSig action related to making multiple payments within a Colony */
  MultiplePaymentMultisig = 'MULTIPLE_PAYMENT_MULTISIG',
  /** An motion action placeholder that should not be used */
  NullMotion = 'NULL_MOTION',
  /** An action related to a payment within a Colony */
  Payment = 'PAYMENT',
  /** An action related to a payment that was created via a motion within a Colony */
  PaymentMotion = 'PAYMENT_MOTION',
  /** An action related to a payment that was created via multiSig within a Colony */
  PaymentMultisig = 'PAYMENT_MULTISIG',
  /** An action related to the recovery functionality of a Colony */
  Recovery = 'RECOVERY',
  /** An action related to a motion to release a staged payment */
  ReleaseStagedPayments = 'RELEASE_STAGED_PAYMENTS',
  /** An action related to a motion to release a staged payment */
  ReleaseStagedPaymentsMotion = 'RELEASE_STAGED_PAYMENTS_MOTION',
  /** An action related to removing verified members */
  RemoveVerifiedMembers = 'REMOVE_VERIFIED_MEMBERS',
  RemoveVerifiedMembersMotion = 'REMOVE_VERIFIED_MEMBERS_MOTION',
  RemoveVerifiedMembersMultisig = 'REMOVE_VERIFIED_MEMBERS_MULTISIG',
  /** An action related to creating a motion to release an expenditure stage */
  SetExpenditureStateMotion = 'SET_EXPENDITURE_STATE_MOTION',
  /** An action related to creating a multiSig to release an expenditure stage */
  SetExpenditureStateMultisig = 'SET_EXPENDITURE_STATE_MULTISIG',
  /** An action related to setting user roles within a Colony */
  SetUserRoles = 'SET_USER_ROLES',
  /** An action related to setting user roles within a Colony via a motion */
  SetUserRolesMotion = 'SET_USER_ROLES_MOTION',
  /** An action related to setting user roles within a Colony via multiSig */
  SetUserRolesMultisig = 'SET_USER_ROLES_MULTISIG',
  /** An action related to unlocking a token within a Colony */
  UnlockToken = 'UNLOCK_TOKEN',
  /** An action related to unlocking a token within a Colony via a motion */
  UnlockTokenMotion = 'UNLOCK_TOKEN_MOTION',
  /** An action related to unlocking a token within a Colony via multiSig */
  UnlockTokenMultisig = 'UNLOCK_TOKEN_MULTISIG',
  /** An action related to upgrading a Colony's version */
  VersionUpgrade = 'VERSION_UPGRADE',
  /** An action related to upgrading a Colony's version via a motion */
  VersionUpgradeMotion = 'VERSION_UPGRADE_MOTION',
  /** An action related to upgrading a Colony's version via multiSig */
  VersionUpgradeMultisig = 'VERSION_UPGRADE_MULTISIG',
  /** An action unrelated to the currently viewed Colony */
  WrongColony = 'WRONG_COLONY',
}

/** Represents a Colony balance for a specific domain and token */
export type ColonyBalance = {
  __typename?: 'ColonyBalance';
  /** Balance of the specific token in the domain */
  balance: Scalars['String'];
  /** Domain associated with the Colony Balance */
  domain?: Maybe<Domain>;
  /** Unique identifier for the Colony Balance */
  id: Scalars['ID'];
  /**
   * Token associated with the Colony Balance
   * Note that for the chain native token, name and symbol are empty
   */
  token: Token;
};

export type ColonyBalanceInput = {
  balance: Scalars['String'];
  domain?: InputMaybe<DomainInput>;
  id?: InputMaybe<Scalars['ID']>;
  token: TokenInput;
};

/** Represents a collection of Colony balances */
export type ColonyBalances = {
  __typename?: 'ColonyBalances';
  /** List of Colony balances */
  items?: Maybe<Array<Maybe<ColonyBalance>>>;
};

export type ColonyBalancesInput = {
  items?: InputMaybe<Array<InputMaybe<ColonyBalanceInput>>>;
};

/**
 * Represents a native Colony Chain Funds Claim
 * E.g., Token 0x0000...0000: ETH, xDAI, etc
 */
export type ColonyChainFundsClaim = {
  __typename?: 'ColonyChainFundsClaim';
  /** Amount claimed in the Colony Chain Funds Claim */
  amount: Scalars['String'];
  /** Timestamp when the Chain Funds Claim was created */
  createdAt: Scalars['AWSDateTime'];
  /** Block number when the Chain Funds Claim was created */
  createdAtBlock: Scalars['Int'];
  /** Unique identifier for the Colony Chain Funds Claim */
  id: Scalars['ID'];
  /** Boolean to indicate whether the claim has been claimed or not */
  isClaimed?: Maybe<Scalars['Boolean']>;
  /** Timestamp when the Chain Funds Claim was last updated */
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyChainFundsClaimInput = {
  amount: Scalars['String'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  isClaimed?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
};

/** The ColonyContributor model represents a contributor to the Colony. */
export type ColonyContributor = {
  __typename?: 'ColonyContributor';
  /** Associated colony */
  colony: Colony;
  /** Address of the colony the contributor is under */
  colonyAddress: Scalars['ID'];
  /** The contributor's reputation percentage in the colony */
  colonyReputationPercentage: Scalars['Float'];
  /** The address of the contributor */
  contributorAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** Does the contributor have any permission in any domain the colony? */
  hasPermissions?: Maybe<Scalars['Boolean']>;
  /** Does the contributor have any reputation the colony? */
  hasReputation?: Maybe<Scalars['Boolean']>;
  /**
   * Unique identifier
   * Format: <colonyAddress>_<contributorAddress>
   */
  id: Scalars['ID'];
  /** Is the contributor a verified member of the colony? */
  isVerified: Scalars['Boolean'];
  /** Is the contributor watching the colony */
  isWatching?: Maybe<Scalars['Boolean']>;
  reputation?: Maybe<ModelContributorReputationConnection>;
  roles?: Maybe<ModelColonyRoleConnection>;
  /** The type of the contributor */
  type?: Maybe<ContributorType>;
  updatedAt: Scalars['AWSDateTime'];
  /** Associated user, if any */
  user?: Maybe<User>;
};

/** The ColonyContributor model represents a contributor to the Colony. */
export type ColonyContributorReputationArgs = {
  colonyAddress?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelContributorReputationFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** The ColonyContributor model represents a contributor to the Colony. */
export type ColonyContributorRolesArgs = {
  colonyAddress?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyDecision = {
  __typename?: 'ColonyDecision';
  action?: Maybe<ColonyAction>;
  actionId: Scalars['ID'];
  colonyAddress: Scalars['String'];
  createdAt: Scalars['AWSDateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  motionDomainId: Scalars['Int'];
  showInDecisionsList: Scalars['Boolean'];
  title: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  walletAddress: Scalars['String'];
};

/** Represents a single extension installation in a Colony */
export type ColonyExtension = {
  __typename?: 'ColonyExtension';
  /** The Colony that the extension belongs to */
  colony: Colony;
  /** The identifier of the Colony that the extension belongs to (the Colony's address) */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /**
   * The unique hash of the extension
   * The hash is generated like so: `keccak256(toUtf8Bytes(extensionName))`, where `extensionName` is the name of the extension contract file in the Colony Network
   */
  hash: Scalars['String'];
  /** Unique identifier for the ColonyExtension */
  id: Scalars['ID'];
  /** The timestamp when the extension was installed */
  installedAt: Scalars['AWSTimestamp'];
  /** The address of the user who installed the extension */
  installedBy: Scalars['String'];
  /** Indicates whether the extension has been removed */
  isDeleted: Scalars['Boolean'];
  /** Indicates whether the extension is deprecated */
  isDeprecated: Scalars['Boolean'];
  /** Indicates whether the extension has been initialized */
  isInitialized: Scalars['Boolean'];
  /** Map of parameters that extension was initialised with */
  params?: Maybe<ExtensionParams>;
  updatedAt: Scalars['AWSDateTime'];
  /** The version number of the extension */
  version: Scalars['Int'];
};

/** Represents a Colony Funds Claim for all ERC20 tokens (except native chain tokens) */
export type ColonyFundsClaim = {
  __typename?: 'ColonyFundsClaim';
  /** Amount claimed in the Colony Funds Claim */
  amount: Scalars['String'];
  colonyFundsClaimTokenId: Scalars['ID'];
  /** The identifier of the Colony the Colony Funds Claim belong to */
  colonyFundsClaimsId?: Maybe<Scalars['ID']>;
  /** Timestamp when the Funds Claim was created */
  createdAt: Scalars['AWSDateTime'];
  /** Block number when the Funds Claim was created */
  createdAtBlock: Scalars['Int'];
  /** Unique identifier for the Colony Funds Claim */
  id: Scalars['ID'];
  /** Boolean to indicate whether the claim has been claimed or not */
  isClaimed?: Maybe<Scalars['Boolean']>;
  /** Token associated with the Colony Funds Claim */
  token: Token;
  updatedAt: Scalars['AWSDateTime'];
};

/** Snapshot of the user's full roles/permissions at a specific block */
export type ColonyHistoricRole = {
  __typename?: 'ColonyHistoricRole';
  /** Block at which the snapshot was taken */
  blockNumber: Scalars['Int'];
  /** Expanded `Colony` model, based on the `colonyId` given */
  colony: Colony;
  /** Unique identifier of the Colony */
  colonyId: Scalars['ID'];
  /** Timestamp at which the database entry was created */
  createdAt: Scalars['AWSDateTime'];
  /** Expanded `Domain` model, based on the `domainId` given */
  domain: Domain;
  /** Unique identifier of the domain */
  domainId: Scalars['ID'];
  /**
   * Unique identifier for the role snapshot
   * Format: `<colonyAddress>_<domainNativeId>_<userAddress>_<blockNumber>_roles`  or `<colonyAddress>_<domainNativeId>_<userAddress>_<blockNumber>_multisig_roles`
   */
  id: Scalars['ID'];
  /** Will be true if the colony role is a multi sig role */
  isMultiSig?: Maybe<Scalars['Boolean']>;
  /** Recovery role */
  role_0?: Maybe<Scalars['Boolean']>;
  /** Root role */
  role_1?: Maybe<Scalars['Boolean']>;
  /** Arbitration role */
  role_2?: Maybe<Scalars['Boolean']>;
  /** Architecture role */
  role_3?: Maybe<Scalars['Boolean']>;
  /** Funding role */
  role_5?: Maybe<Scalars['Boolean']>;
  /** Administration role */
  role_6?: Maybe<Scalars['Boolean']>;
  /** Address of the agent the permission was set for */
  targetAddress?: Maybe<Scalars['ID']>;
  /** Will expand to a `Colony` model if permission was set for another Colony */
  targetColony?: Maybe<Colony>;
  /** Will expand to a `ColonyExtension` model if permission was set for a Colony extension */
  targetExtension?: Maybe<ColonyExtension>;
  /** Will expand to a `Token` model if permission was set for a Token contract */
  targetToken?: Maybe<Token>;
  /** Will expand to a `User` model if permission was set for a user */
  targetUser?: Maybe<User>;
  /** Used for amplify sorting. Set to `SortedHistoricRole` */
  type: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyMemberInvite = {
  __typename?: 'ColonyMemberInvite';
  /** Colony associated with the ColonyMemberInvite */
  colony: Colony;
  /** Colony ID associated with the ColonyMemberInvite */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** Self-managed id which is used as the invite code */
  id: Scalars['ID'];
  /** Decrementing count of how many times this invite has been used */
  invitesRemaining: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents metadata for a Colony */
export type ColonyMetadata = {
  __typename?: 'ColonyMetadata';
  /** URL of the Colony's avatar image */
  avatar?: Maybe<Scalars['String']>;
  /** List of Colony metadata changelog entries */
  changelog?: Maybe<Array<ColonyMetadataChangelog>>;
  createdAt: Scalars['AWSDateTime'];
  /** Description of the colony */
  description?: Maybe<Scalars['String']>;
  /** Display name of the Colony */
  displayName: Scalars['String'];
  /** Temporary data to store while the colony is being created (via the block ingestor) */
  etherealData?: Maybe<ColonyMetadataEtherealData>;
  /** An array of external links to related pages */
  externalLinks?: Maybe<Array<ExternalLink>>;
  /** Unique identifier for the Colony (contract address) */
  id: Scalars['ID'];
  /** Colony Objective */
  objective?: Maybe<ColonyObjective>;
  /** List of safes that are used within the Colony */
  safes?: Maybe<Array<Safe>>;
  /** URL of the Colony's thumbnail image */
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
};

/**
 * Represents a changelog entry for Colony metadata
 * This is used to traverse through the history of metadata values and consolidate them into a final state
 */
export type ColonyMetadataChangelog = {
  __typename?: 'ColonyMetadataChangelog';
  /** Indicates whether the avatar has changed */
  hasAvatarChanged: Scalars['Boolean'];
  /** Whether the colony description has changed */
  hasDescriptionChanged?: Maybe<Scalars['Boolean']>;
  /** Whether the colony's objective has changed */
  hasObjectiveChanged?: Maybe<Scalars['Boolean']>;
  /** Whether the colony's external links have changed */
  haveExternalLinksChanged?: Maybe<Scalars['Boolean']>;
  /** Display name of the Colony after the change */
  newDisplayName: Scalars['String'];
  /** Whether safes have been added or removed from the Colony's safe list */
  newSafes?: Maybe<Array<Safe>>;
  /** Display name of the Colony before the change */
  oldDisplayName: Scalars['String'];
  oldSafes?: Maybe<Array<Safe>>;
  /** Transaction hash associated with the changelog entry */
  transactionHash: Scalars['String'];
};

export type ColonyMetadataChangelogInput = {
  hasAvatarChanged: Scalars['Boolean'];
  hasDescriptionChanged?: InputMaybe<Scalars['Boolean']>;
  hasObjectiveChanged?: InputMaybe<Scalars['Boolean']>;
  haveExternalLinksChanged?: InputMaybe<Scalars['Boolean']>;
  newDisplayName: Scalars['String'];
  newSafes?: InputMaybe<Array<SafeInput>>;
  oldDisplayName: Scalars['String'];
  oldSafes?: InputMaybe<Array<SafeInput>>;
  transactionHash: Scalars['String'];
};

export type ColonyMetadataEtherealData = {
  __typename?: 'ColonyMetadataEtherealData';
  colonyAvatar?: Maybe<Scalars['String']>;
  colonyDisplayName: Scalars['String'];
  colonyName: Scalars['String'];
  colonyThumbnail?: Maybe<Scalars['String']>;
  initiatorAddress: Scalars['ID'];
  tokenAvatar?: Maybe<Scalars['String']>;
  tokenThumbnail?: Maybe<Scalars['String']>;
};

export type ColonyMetadataEtherealDataInput = {
  colonyAvatar?: InputMaybe<Scalars['String']>;
  colonyDisplayName: Scalars['String'];
  colonyName: Scalars['String'];
  colonyThumbnail?: InputMaybe<Scalars['String']>;
  initiatorAddress: Scalars['ID'];
  tokenAvatar?: InputMaybe<Scalars['String']>;
  tokenThumbnail?: InputMaybe<Scalars['String']>;
};

/** Represents a Motion within a Colony */
export type ColonyMotion = {
  __typename?: 'ColonyMotion';
  action?: Maybe<ColonyAction>;
  createdAt: Scalars['AWSDateTime'];
  /**
   * Address of the VotingReputation extension
   * Useful to check if we're viewing a "read-only" motion
   */
  createdBy: Scalars['String'];
  /** Edited expenditure slots associated with the motion, if any */
  editedExpenditureSlots?: Maybe<Array<ExpenditureSlot>>;
  /**
   * In case of multicall motion funding an expenditure, array containing
   * the details of tokens and amounts to be funded
   */
  expenditureFunding?: Maybe<Array<ExpenditureFundingItem>>;
  /** Expenditure associated with the motion, if any */
  expenditureId?: Maybe<Scalars['ID']>;
  /** Ids of the staged payment slots to be released if the motion pass, if any */
  expenditureSlotIds?: Maybe<Array<Scalars['Int']>>;
  /** Simple flag indicating whether both sides of staking have been activated */
  hasObjection: Scalars['Boolean'];
  /**
   * The internal database id of the motion
   * To ensure uniqueness, we format as: `chainId-votingRepExtnAddress_nativeMotionId`
   */
  id: Scalars['ID'];
  /** Whether the motion is a Simple Decision */
  isDecision: Scalars['Boolean'];
  /** Whether the motion was finalized or not */
  isFinalized: Scalars['Boolean'];
  messages?: Maybe<ModelMotionMessageConnection>;
  /** Expanded domain in which the motion was created */
  motionDomain: Domain;
  /** Unique identifier of the motions domain in the database */
  motionDomainId: Scalars['ID'];
  /** Staked sides of a motion */
  motionStakes: MotionStakes;
  /** Quick access flages to check the current state of a motion in its lifecycle */
  motionStateHistory: MotionStateHistory;
  /** The on chain id of the domain associated with the motion */
  nativeMotionDomainId: Scalars['String'];
  /** The on chain id of the motion */
  nativeMotionId: Scalars['String'];
  /** The annotation object associated with the objection to the motion, if any */
  objectionAnnotation?: Maybe<Annotation>;
  /** Id of the associated objection annotation, if any */
  objectionAnnotationId?: Maybe<Scalars['ID']>;
  /**
   * Stakes remaining to activate either side of the motion
   * It's a tuple: `[nayRemaining, yayRemaining]`
   */
  remainingStakes: Array<Scalars['String']>;
  /** The amount of reputaion that has submitted a vote */
  repSubmitted: Scalars['String'];
  /** The total required stake for one side to be activated */
  requiredStake: Scalars['String'];
  /** Total voting outcome for the motion (accumulated votes) */
  revealedVotes: MotionStakes;
  /** The total amount of reputation (among all users) that can vote for this motion */
  skillRep: Scalars['String'];
  /** List of staker rewards users will be receiving for a motion */
  stakerRewards: Array<StakerRewards>;
  /** The transaction hash of the createMotion action */
  transactionHash: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  /** The minimum stake that a user has to provide for it to be accepted */
  userMinStake: Scalars['String'];
  /** List of stakes that users have made for a motion */
  usersStakes: Array<UserMotionStakes>;
  /** A list of all of the votes cast within in the motion */
  voterRecord: Array<VoterRecord>;
  voterRewards?: Maybe<ModelVoterRewardsHistoryConnection>;
};

/** Represents a Motion within a Colony */
export type ColonyMotionMessagesArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a Motion within a Colony */
export type ColonyMotionVoterRewardsArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelVoterRewardsHistoryFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a MultiSig motion within a Colony */
export type ColonyMultiSig = {
  __typename?: 'ColonyMultiSig';
  action?: Maybe<ColonyAction>;
  /** Colony address the multiSig belongs to */
  colonyAddress: Scalars['ID'];
  /** The timestamp when the motion was created at */
  createdAt: Scalars['AWSDateTime'];
  /** The timestamp when the motion was finalized */
  executedAt?: Maybe<Scalars['AWSDateTime']>;
  /** Wallet address of the user finalizing the motion */
  executedBy?: Maybe<Scalars['ID']>;
  /** Extended user object for given executedBy */
  executedByUser?: Maybe<User>;
  /**
   * In case of multiple funding actions in a multisig, when funding an expenditure, array containing
   * the details of tokens and amounts to be funded
   */
  expenditureFunding?: Maybe<Array<ExpenditureFundingItem>>;
  /** Expenditure associated with the motion, if any */
  expenditureId?: Maybe<Scalars['ID']>;
  /** Whether the underlying action completed */
  hasActionCompleted: Scalars['Boolean'];
  /**
   * The internal database id of the multiSig
   * To ensure uniqueness, we format as: `chainId-multiSigExtnAddress_nativeMultiSigId`
   */
  id: Scalars['ID'];
  /** Whether the multiSig is a Simple Decision */
  isDecision: Scalars['Boolean'];
  /** Whether the multiSig was executed or not */
  isExecuted: Scalars['Boolean'];
  /** Whether the multiSig was cancelled or not */
  isRejected: Scalars['Boolean'];
  /** Expanded domain in which the multiSig was created */
  multiSigDomain: Domain;
  /** Unique identifier of the multiSigs domain in the database */
  multiSigDomainId: Scalars['ID'];
  /** The on chain id of the domain associated with the motion */
  nativeMultiSigDomainId: Scalars['String'];
  /** The on chain id of the multiSig */
  nativeMultiSigId: Scalars['ID'];
  /** The timestamp when the motion was rejected */
  rejectedAt?: Maybe<Scalars['AWSDateTime']>;
  /** Wallet address of the user rejecting the motion */
  rejectedBy?: Maybe<Scalars['ID']>;
  /** Extended user object for given rejectedBy */
  rejectedByUser?: Maybe<User>;
  /** Required role for signing */
  requiredPermissions: Scalars['Int'];
  signatures?: Maybe<ModelMultiSigUserSignatureConnection>;
  /** The transaction hash of the creteMotion (multisig) action */
  transactionHash: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents a MultiSig motion within a Colony */
export type ColonyMultiSigSignaturesArgs = {
  filter?: InputMaybe<ModelMultiSigUserSignatureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyObjective = {
  __typename?: 'ColonyObjective';
  /** Description of the objective with a limit of 120 characters */
  description: Scalars['String'];
  /** Number representing how complete the objective is, must be between 0 and 100 */
  progress: Scalars['Int'];
  /** Title of the objective */
  title: Scalars['String'];
};

export type ColonyObjectiveInput = {
  description: Scalars['String'];
  progress: Scalars['Int'];
  title: Scalars['String'];
};

/** A snapshot of the current set of permissions a given address has in a given domain within a Colony */
export type ColonyRole = {
  __typename?: 'ColonyRole';
  /** The colony in which the role was set */
  colonyAddress: Scalars['ID'];
  colonyRolesId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  /** Expanded `Domain` model, based on the `domainId` given */
  domain: Domain;
  /** Unique identifier of the domain */
  domainId: Scalars['ID'];
  /**
   * Unique identifier for the role snapshot
   * Format: `<colonyAddress>_<domainNativeId>_<userAddress>_roles` or `<colonyAddress>_<domainNativeId>_<userAddress>_multisig_roles`
   */
  id: Scalars['ID'];
  /** Will be true if the colony role is a multi sig role */
  isMultiSig?: Maybe<Scalars['Boolean']>;
  /** Block at which permissions were update last */
  latestBlock: Scalars['Int'];
  /** Recovery role */
  role_0?: Maybe<Scalars['Boolean']>;
  /** Root role */
  role_1?: Maybe<Scalars['Boolean']>;
  /** Arbitration role */
  role_2?: Maybe<Scalars['Boolean']>;
  /** Architecture role */
  role_3?: Maybe<Scalars['Boolean']>;
  /** Funding role */
  role_5?: Maybe<Scalars['Boolean']>;
  /** Administration role */
  role_6?: Maybe<Scalars['Boolean']>;
  /** Address of the agent the permission was set for */
  targetAddress: Scalars['ID'];
  /** Will expand to a `Colony` model if permission was set for another Colony */
  targetColony?: Maybe<Colony>;
  /** Will expand to a `ColonyExtension` model if permission was set for a Colony extension */
  targetExtension?: Maybe<ColonyExtension>;
  /** Will expand to a `Token` model if permission was set for a Token contract */
  targetToken?: Maybe<Token>;
  /** Will expand to a `User` model if permission was set for a user */
  targetUser?: Maybe<User>;
  updatedAt: Scalars['AWSDateTime'];
};

/**
 * Represents the status of a Colony
 *
 * This contains important meta information about the Colony's token and other fundamental settings
 */
export type ColonyStatus = {
  __typename?: 'ColonyStatus';
  /** Status information for the Colony's native token */
  nativeToken?: Maybe<NativeTokenStatus>;
  /** Whether the Colony is in recovery mode */
  recovery?: Maybe<Scalars['Boolean']>;
};

/**
 * Input data for a Colony's status information
 *
 * This is set when a Colony is created and can be changed later
 */
export type ColonyStatusInput = {
  /** Status information for the Colony's native token */
  nativeToken?: InputMaybe<NativeTokenStatusInput>;
  /** Whether the Colony is in recovery mode */
  recovery?: InputMaybe<Scalars['Boolean']>;
};

export type ColonyTokens = {
  __typename?: 'ColonyTokens';
  colony: Colony;
  colonyID: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  token: Token;
  tokenID: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Variants of Colony types */
export enum ColonyType {
  /** A regular Colony */
  Colony = 'COLONY',
  /** The MetaColony, which governs the entire Colony Network */
  Metacolony = 'METACOLONY',
}

/** Unclaimed staking rewards for a motion */
export type ColonyUnclaimedStake = {
  __typename?: 'ColonyUnclaimedStake';
  /** The on chain id of the motion */
  motionId: Scalars['String'];
  /** List of unclaimed staking rewards for that motion */
  unclaimedRewards: Array<StakerRewards>;
};

export type ColonyUnclaimedStakeInput = {
  motionId: Scalars['String'];
  unclaimedRewards: Array<StakerRewardsInput>;
};

/** Represents an event triggered by a smart contract within the Colony Network */
export type ContractEvent = {
  __typename?: 'ContractEvent';
  /** Address of the agent who initiated the event */
  agent: Scalars['String'];
  /** Metadata associated with the event's chain */
  chainMetadata: ChainMetadata;
  /** Optional association with a Colony */
  colony?: Maybe<Colony>;
  contractEventColonyId?: Maybe<Scalars['ID']>;
  contractEventDomainId?: Maybe<Scalars['ID']>;
  contractEventTokenId?: Maybe<Scalars['ID']>;
  contractEventUserId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  /** Optional association with a Domain */
  domain?: Maybe<Domain>;
  /** Optional encoded arguments as a JSON string */
  encodedArguments?: Maybe<Scalars['String']>;
  /** Unique identifier for the Contract Event, in the format chainID_transactionHash_logIndex */
  id: Scalars['ID'];
  /** Name of the event */
  name: Scalars['String'];
  /** The unique signature of the event */
  signature: Scalars['String'];
  /** Address of the target contract on the receiving end of the event */
  target: Scalars['String'];
  /** Optional association with a Token */
  token?: Maybe<Token>;
  updatedAt: Scalars['AWSDateTime'];
  /** Optional association with a User */
  user?: Maybe<User>;
};

export type ContributorReputation = {
  __typename?: 'ContributorReputation';
  /** The colony the reputation was earned in */
  colonyAddress: Scalars['ID'];
  /** The address of the contributor */
  contributorAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** The associated Domain model */
  domain: Domain;
  /** The domain id in which the contributor has reputation */
  domainId: Scalars['ID'];
  /**
   * Unique identifier
   * Format: `<colonyAddress>_<domainNativeId>_<contributorAddress>`
   */
  id: Scalars['ID'];
  /** The percentage of the contributor's reputation in the domain */
  reputationPercentage: Scalars['Float'];
  /** The raw value of the contributor's reputation in the domain */
  reputationRaw: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** The types of contributor a user can be in a colony */
export enum ContributorType {
  Active = 'ACTIVE',
  Dedicated = 'DEDICATED',
  General = 'GENERAL',
  New = 'NEW',
  Top = 'TOP',
}

export type CreateAnnotationInput = {
  actionId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  ipfsHash?: InputMaybe<Scalars['String']>;
  message: Scalars['String'];
};

export type CreateCacheTotalBalanceInput = {
  colonyAddress: Scalars['ID'];
  date: Scalars['AWSDateTime'];
  domainId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  timeframePeriod: Scalars['Int'];
  timeframeType: TimeframeType;
  totalUSDC?: InputMaybe<Scalars['String']>;
  totalUSDCIn?: InputMaybe<Scalars['String']>;
  totalUSDCOut?: InputMaybe<Scalars['String']>;
};

export type CreateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  annotationId?: InputMaybe<Scalars['ID']>;
  approvedTokenChanges?: InputMaybe<ApprovedTokenChangesInput>;
  arbitraryTransactions?: InputMaybe<
    Array<ColonyActionArbitraryTransactionInput>
  >;
  blockNumber: Scalars['Int'];
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyDecisionId?: InputMaybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  expenditureId?: InputMaybe<Scalars['ID']>;
  expenditureSlotChanges?: InputMaybe<ExpenditureSlotChangesInput>;
  expenditureSlotIds?: InputMaybe<Array<Scalars['Int']>>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fromPotId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  individualEvents?: InputMaybe<Scalars['String']>;
  initiatorAddress: Scalars['ID'];
  isMotion?: InputMaybe<Scalars['Boolean']>;
  isMotionFinalization?: InputMaybe<Scalars['Boolean']>;
  isMultiSig?: InputMaybe<Scalars['Boolean']>;
  members?: InputMaybe<Array<Scalars['ID']>>;
  motionDomainId?: InputMaybe<Scalars['Int']>;
  motionId?: InputMaybe<Scalars['ID']>;
  multiSigId?: InputMaybe<Scalars['ID']>;
  networkFee?: InputMaybe<Scalars['String']>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  paymentId?: InputMaybe<Scalars['Int']>;
  payments?: InputMaybe<Array<PaymentInput>>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  roles?: InputMaybe<ColonyActionRolesInput>;
  rolesAreMultiSig?: InputMaybe<Scalars['Boolean']>;
  rootHash: Scalars['String'];
  showInActionsList: Scalars['Boolean'];
  toDomainId?: InputMaybe<Scalars['ID']>;
  toPotId?: InputMaybe<Scalars['Int']>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  type: ColonyActionType;
};

export type CreateColonyActionMetadataInput = {
  arbitraryTxAbis?: InputMaybe<Array<ArbitraryTxAbiInput>>;
  customTitle: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
};

export type CreateColonyContributorInput = {
  colonyAddress: Scalars['ID'];
  colonyReputationPercentage: Scalars['Float'];
  contributorAddress: Scalars['ID'];
  hasPermissions?: InputMaybe<Scalars['Boolean']>;
  hasReputation?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  isVerified: Scalars['Boolean'];
  isWatching?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<ContributorType>;
};

export type CreateColonyDecisionInput = {
  actionId: Scalars['ID'];
  colonyAddress: Scalars['String'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  description: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  motionDomainId: Scalars['Int'];
  showInDecisionsList: Scalars['Boolean'];
  title: Scalars['String'];
  walletAddress: Scalars['String'];
};

/** Input data for creating a temporary colony metadata entry */
export type CreateColonyEtherealMetadataInput = {
  /** Colony avatar/thumbnail */
  colonyAvatar?: InputMaybe<Scalars['String']>;
  /** Colony name */
  colonyDisplayName: Scalars['String'];
  /** Colony slug */
  colonyName: Scalars['String'];
  /** Colony avatar/thumbnail */
  colonyThumbnail?: InputMaybe<Scalars['String']>;
  /** User id of creator to associate with further invite codes */
  initiatorAddress: Scalars['ID'];
  /** Invite Code to create Colony */
  inviteCode: Scalars['ID'];
  /** Token avatar/thumbnail */
  tokenAvatar?: InputMaybe<Scalars['String']>;
  /** Token avatar/thumbnail */
  tokenThumbnail?: InputMaybe<Scalars['String']>;
  /** The transaction hash of colony creation transaction */
  transactionHash: Scalars['String'];
};

export type CreateColonyExtensionInput = {
  colonyId: Scalars['ID'];
  hash: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  installedAt: Scalars['AWSTimestamp'];
  installedBy: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  isDeprecated: Scalars['Boolean'];
  isInitialized: Scalars['Boolean'];
  params?: InputMaybe<ExtensionParamsInput>;
  version: Scalars['Int'];
};

export type CreateColonyFundsClaimInput = {
  amount: Scalars['String'];
  colonyFundsClaimTokenId: Scalars['ID'];
  colonyFundsClaimsId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  isClaimed?: InputMaybe<Scalars['Boolean']>;
};

export type CreateColonyHistoricRoleInput = {
  blockNumber: Scalars['Int'];
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  isMultiSig?: InputMaybe<Scalars['Boolean']>;
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
  type: Scalars['String'];
};

export type CreateColonyInput = {
  balances?: InputMaybe<ColonyBalancesInput>;
  chainFundsClaim?: InputMaybe<ColonyChainFundsClaimInput>;
  chainMetadata: ChainMetadataInput;
  colonyMemberInviteCode?: InputMaybe<Scalars['ID']>;
  createdAtBlock?: InputMaybe<Scalars['Int']>;
  expendituresGlobalClaimDelay?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  lastUpdatedContributorsWithReputation?: InputMaybe<Scalars['AWSDateTime']>;
  motionsWithUnclaimedStakes?: InputMaybe<Array<ColonyUnclaimedStakeInput>>;
  name: Scalars['String'];
  nativeTokenId: Scalars['ID'];
  private?: InputMaybe<Scalars['Boolean']>;
  reputation?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateColonyMemberInviteInput = {
  colonyId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  invitesRemaining: Scalars['Int'];
};

export type CreateColonyMetadataInput = {
  avatar?: InputMaybe<Scalars['String']>;
  changelog?: InputMaybe<Array<ColonyMetadataChangelogInput>>;
  description?: InputMaybe<Scalars['String']>;
  displayName: Scalars['String'];
  etherealData?: InputMaybe<ColonyMetadataEtherealDataInput>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  id?: InputMaybe<Scalars['ID']>;
  objective?: InputMaybe<ColonyObjectiveInput>;
  safes?: InputMaybe<Array<SafeInput>>;
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type CreateColonyMotionInput = {
  createdBy: Scalars['String'];
  editedExpenditureSlots?: InputMaybe<Array<ExpenditureSlotInput>>;
  expenditureFunding?: InputMaybe<Array<ExpenditureFundingItemInput>>;
  expenditureId?: InputMaybe<Scalars['ID']>;
  expenditureSlotIds?: InputMaybe<Array<Scalars['Int']>>;
  hasObjection: Scalars['Boolean'];
  id?: InputMaybe<Scalars['ID']>;
  isDecision: Scalars['Boolean'];
  isFinalized: Scalars['Boolean'];
  motionDomainId: Scalars['ID'];
  motionStakes: MotionStakesInput;
  motionStateHistory: MotionStateHistoryInput;
  nativeMotionDomainId: Scalars['String'];
  nativeMotionId: Scalars['String'];
  objectionAnnotationId?: InputMaybe<Scalars['ID']>;
  remainingStakes: Array<Scalars['String']>;
  repSubmitted: Scalars['String'];
  requiredStake: Scalars['String'];
  revealedVotes: MotionStakesInput;
  skillRep: Scalars['String'];
  stakerRewards: Array<StakerRewardsInput>;
  transactionHash: Scalars['ID'];
  userMinStake: Scalars['String'];
  usersStakes: Array<UserMotionStakesInput>;
  voterRecord: Array<VoterRecordInput>;
};

export type CreateColonyMultiSigInput = {
  colonyAddress: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  executedAt?: InputMaybe<Scalars['AWSDateTime']>;
  executedBy?: InputMaybe<Scalars['ID']>;
  expenditureFunding?: InputMaybe<Array<ExpenditureFundingItemInput>>;
  expenditureId?: InputMaybe<Scalars['ID']>;
  hasActionCompleted: Scalars['Boolean'];
  id?: InputMaybe<Scalars['ID']>;
  isDecision: Scalars['Boolean'];
  isExecuted: Scalars['Boolean'];
  isRejected: Scalars['Boolean'];
  multiSigDomainId: Scalars['ID'];
  nativeMultiSigDomainId: Scalars['String'];
  nativeMultiSigId: Scalars['ID'];
  rejectedAt?: InputMaybe<Scalars['AWSDateTime']>;
  rejectedBy?: InputMaybe<Scalars['ID']>;
  requiredPermissions: Scalars['Int'];
  transactionHash: Scalars['ID'];
};

export type CreateColonyRoleInput = {
  colonyAddress: Scalars['ID'];
  colonyRolesId?: InputMaybe<Scalars['ID']>;
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  isMultiSig?: InputMaybe<Scalars['Boolean']>;
  latestBlock: Scalars['Int'];
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress: Scalars['ID'];
};

export type CreateColonyTokensInput = {
  colonyID: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  tokenID: Scalars['ID'];
};

export type CreateContractEventInput = {
  agent: Scalars['String'];
  chainMetadata: ChainMetadataInput;
  contractEventColonyId?: InputMaybe<Scalars['ID']>;
  contractEventDomainId?: InputMaybe<Scalars['ID']>;
  contractEventTokenId?: InputMaybe<Scalars['ID']>;
  contractEventUserId?: InputMaybe<Scalars['ID']>;
  encodedArguments?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  signature: Scalars['String'];
  target: Scalars['String'];
};

export type CreateContributorReputationInput = {
  colonyAddress: Scalars['ID'];
  contributorAddress: Scalars['ID'];
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  reputationPercentage: Scalars['Float'];
  reputationRaw: Scalars['String'];
};

export type CreateCurrentNetworkInverseFeeInput = {
  id?: InputMaybe<Scalars['ID']>;
  inverseFee: Scalars['String'];
};

export type CreateCurrentVersionInput = {
  id?: InputMaybe<Scalars['ID']>;
  key: Scalars['String'];
  version: Scalars['Int'];
};

export type CreateDomainInput = {
  colonyId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  isRoot: Scalars['Boolean'];
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  nativeSkillId: Scalars['String'];
  reputation?: InputMaybe<Scalars['String']>;
  reputationPercentage?: InputMaybe<Scalars['String']>;
};

export type CreateDomainMetadataInput = {
  changelog?: InputMaybe<Array<DomainMetadataChangelogInput>>;
  color: DomainColor;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type CreateExpenditureInput = {
  balances?: InputMaybe<Array<ExpenditureBalanceInput>>;
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  finalizedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  firstEditTransactionHash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  isStaked: Scalars['Boolean'];
  nativeDomainId: Scalars['Int'];
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  ownerAddress: Scalars['ID'];
  slots: Array<ExpenditureSlotInput>;
  splitPaymentPayoutClaimedNotificationSent?: InputMaybe<Scalars['Boolean']>;
  stagedExpenditureAddress?: InputMaybe<Scalars['ID']>;
  stakedExpenditureAddress?: InputMaybe<Scalars['ID']>;
  status: ExpenditureStatus;
  type: ExpenditureType;
  userStakeId?: InputMaybe<Scalars['ID']>;
};

export type CreateExpenditureMetadataInput = {
  distributionType?: InputMaybe<SplitPaymentDistributionType>;
  expectedNumberOfPayouts?: InputMaybe<Scalars['Int']>;
  expectedNumberOfTokens?: InputMaybe<Scalars['Int']>;
  fundFromDomainNativeId: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  stages?: InputMaybe<Array<ExpenditureStageInput>>;
};

export type CreateExtensionInstallationsCountInput = {
  id?: InputMaybe<Scalars['ID']>;
  multiSigPermissions: Scalars['Int'];
  oneTxPayment: Scalars['Int'];
  reputationWeighted: Scalars['Int'];
  stagedExpenditure: Scalars['Int'];
  stakedExpenditure: Scalars['Int'];
  streamingPayments: Scalars['Int'];
};

export type CreateIngestorStatsInput = {
  id?: InputMaybe<Scalars['ID']>;
  value: Scalars['String'];
};

export type CreateLiquidationAddressInput = {
  chainId: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  liquidationAddress: Scalars['ID'];
  userAddress: Scalars['ID'];
};

export type CreateMotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  initiatorAddress: Scalars['ID'];
  messageKey: Scalars['String'];
  motionId: Scalars['ID'];
  name: Scalars['String'];
  vote?: InputMaybe<Scalars['String']>;
};

export type CreateMultiSigUserSignatureInput = {
  colonyAddress: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  multiSigId: Scalars['ID'];
  role: Scalars['Int'];
  userAddress: Scalars['ID'];
  vote: MultiSigVote;
};

export type CreateNotificationsDataInput = {
  adminNotificationsDisabled: Scalars['Boolean'];
  magicbellUserId: Scalars['ID'];
  mentionNotificationsDisabled: Scalars['Boolean'];
  mutedColonyAddresses: Array<Scalars['ID']>;
  notificationsDisabled: Scalars['Boolean'];
  paymentNotificationsDisabled: Scalars['Boolean'];
  userAddress: Scalars['ID'];
};

export type CreatePrivateBetaInviteCodeInput = {
  id?: InputMaybe<Scalars['ID']>;
  shareableInvites?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type CreateProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  displayNameChanged?: InputMaybe<Scalars['AWSDateTime']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  hasCompletedKYCFlow?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  isAutoOfframpEnabled?: InputMaybe<Scalars['Boolean']>;
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  preferredCurrency?: InputMaybe<SupportedCurrencies>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type CreateProxyColonyInput = {
  chainId: Scalars['String'];
  colonyAddress: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  isActive: Scalars['Boolean'];
};

export type CreateReputationMiningCycleMetadataInput = {
  id?: InputMaybe<Scalars['ID']>;
  lastCompletedAt: Scalars['AWSDateTime'];
};

export type CreateSafeTransactionDataInput = {
  abi?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['String']>;
  contract?: InputMaybe<SimpleTargetInput>;
  contractFunction?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<Scalars['String']>;
  functionParams?: InputMaybe<Array<InputMaybe<FunctionParamInput>>>;
  id?: InputMaybe<Scalars['ID']>;
  nft?: InputMaybe<NftInput>;
  nftData?: InputMaybe<NftDataInput>;
  rawAmount?: InputMaybe<Scalars['String']>;
  recipient?: InputMaybe<SimpleTargetInput>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  transactionHash: Scalars['ID'];
  transactionType: SafeTransactionType;
};

export type CreateSafeTransactionInput = {
  id?: InputMaybe<Scalars['ID']>;
  safe: SafeInput;
};

export type CreateStreamingPaymentInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  endTime: Scalars['AWSTimestamp'];
  id?: InputMaybe<Scalars['ID']>;
  interval: Scalars['String'];
  nativeDomainId: Scalars['Int'];
  nativeId: Scalars['Int'];
  payouts?: InputMaybe<Array<ExpenditurePayoutInput>>;
  recipientAddress: Scalars['String'];
  startTime: Scalars['AWSTimestamp'];
};

export type CreateStreamingPaymentMetadataInput = {
  endCondition: StreamingPaymentEndCondition;
  id?: InputMaybe<Scalars['ID']>;
  limitAmount?: InputMaybe<Scalars['String']>;
};

export type CreateTokenExchangeRateInput = {
  date: Scalars['AWSDateTime'];
  id?: InputMaybe<Scalars['ID']>;
  marketPrice: Array<InputMaybe<MarketPriceInput>>;
  tokenId: Scalars['String'];
};

export type CreateTokenInput = {
  avatar?: InputMaybe<Scalars['String']>;
  chainMetadata: ChainMetadataInput;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  thumbnail?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TokenType>;
  validated?: InputMaybe<Scalars['Boolean']>;
};

export type CreateTransactionInput = {
  blockHash?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyAddress: Scalars['ID'];
  context: ClientType;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  deployedContractAddress?: InputMaybe<Scalars['String']>;
  error?: InputMaybe<TransactionErrorInput>;
  eventData?: InputMaybe<Scalars['String']>;
  from: Scalars['ID'];
  gasLimit?: InputMaybe<Scalars['String']>;
  gasPrice?: InputMaybe<Scalars['String']>;
  group: TransactionGroupInput;
  groupId: Scalars['ID'];
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  identifier?: InputMaybe<Scalars['String']>;
  loadingRelated?: InputMaybe<Scalars['Boolean']>;
  methodContext?: InputMaybe<Scalars['String']>;
  methodName: Scalars['String'];
  options?: InputMaybe<Scalars['String']>;
  params?: InputMaybe<Scalars['String']>;
  receipt?: InputMaybe<Scalars['String']>;
  status: TransactionStatus;
  title?: InputMaybe<Scalars['String']>;
  titleValues?: InputMaybe<Scalars['String']>;
};

/** Input data for creating a unique user within the Colony Network Use this instead of the automatically generated `CreateUserInput` input type */
export type CreateUniqueUserInput = {
  /** Unique identifier for the user. This is the user's wallet address */
  id: Scalars['ID'];
  /** Profile data for the user */
  profile: ProfileInput;
};

export type CreateUserInput = {
  bridgeCustomerId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  profileId?: InputMaybe<Scalars['ID']>;
  userPrivateBetaInviteCodeId?: InputMaybe<Scalars['ID']>;
};

/** Input data for creating notifications data for a user */
export type CreateUserNotificationsDataInput = {
  /** Unique identifier for the user. This is the user's wallet address */
  id: Scalars['ID'];
};

export type CreateUserStakeInput = {
  actionId: Scalars['ID'];
  amount: Scalars['String'];
  colonyAddress: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  isClaimed: Scalars['Boolean'];
  isForfeited?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<UserStakeType>;
  userAddress: Scalars['ID'];
};

export type CreateUserTokensInput = {
  id?: InputMaybe<Scalars['ID']>;
  tokenID: Scalars['ID'];
  userID: Scalars['ID'];
};

export type CreateVoterRewardsHistoryInput = {
  amount: Scalars['String'];
  colonyAddress: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  motionId: Scalars['ID'];
  userAddress: Scalars['ID'];
};

/**
 * The current inverse of the network fee (in wei)
 * (divide 1 by it and get the actual network fee)
 */
export type CurrentNetworkInverseFee = {
  __typename?: 'CurrentNetworkInverseFee';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the network fee */
  id: Scalars['ID'];
  /** The inverse fee */
  inverseFee: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents the current version of an entity in the system */
export type CurrentVersion = {
  __typename?: 'CurrentVersion';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the CurrentVersion */
  id: Scalars['ID'];
  /** The key used to look up the current version */
  key: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  /** The current version number */
  version: Scalars['Int'];
};

export type DeleteAnnotationInput = {
  id: Scalars['ID'];
};

export type DeleteCacheTotalBalanceInput = {
  id: Scalars['ID'];
};

export type DeleteColonyActionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyActionMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteColonyContributorInput = {
  id: Scalars['ID'];
};

export type DeleteColonyDecisionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyExtensionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyFundsClaimInput = {
  id: Scalars['ID'];
};

export type DeleteColonyHistoricRoleInput = {
  id: Scalars['ID'];
};

export type DeleteColonyInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMemberInviteInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMotionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMultiSigInput = {
  id: Scalars['ID'];
};

export type DeleteColonyRoleInput = {
  id: Scalars['ID'];
};

export type DeleteColonyTokensInput = {
  id: Scalars['ID'];
};

export type DeleteContractEventInput = {
  id: Scalars['ID'];
};

export type DeleteContributorReputationInput = {
  id: Scalars['ID'];
};

export type DeleteCurrentNetworkInverseFeeInput = {
  id: Scalars['ID'];
};

export type DeleteCurrentVersionInput = {
  id: Scalars['ID'];
};

export type DeleteDomainInput = {
  id: Scalars['ID'];
};

export type DeleteDomainMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteExpenditureInput = {
  id: Scalars['ID'];
};

export type DeleteExpenditureMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteExtensionInstallationsCountInput = {
  id: Scalars['ID'];
};

export type DeleteIngestorStatsInput = {
  id: Scalars['ID'];
};

export type DeleteLiquidationAddressInput = {
  id: Scalars['ID'];
};

export type DeleteMotionMessageInput = {
  id: Scalars['ID'];
};

export type DeleteMultiSigUserSignatureInput = {
  id: Scalars['ID'];
};

export type DeleteNotificationsDataInput = {
  userAddress: Scalars['ID'];
};

export type DeletePrivateBetaInviteCodeInput = {
  id: Scalars['ID'];
};

export type DeleteProfileInput = {
  id: Scalars['ID'];
};

export type DeleteProxyColonyInput = {
  id: Scalars['ID'];
};

export type DeleteReputationMiningCycleMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteSafeTransactionDataInput = {
  id: Scalars['ID'];
};

export type DeleteSafeTransactionInput = {
  id: Scalars['ID'];
};

export type DeleteStreamingPaymentInput = {
  id: Scalars['ID'];
};

export type DeleteStreamingPaymentMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteTokenExchangeRateInput = {
  id: Scalars['ID'];
};

export type DeleteTokenInput = {
  id: Scalars['ID'];
};

export type DeleteTransactionInput = {
  id: Scalars['ID'];
};

export type DeleteUserInput = {
  id: Scalars['ID'];
};

export type DeleteUserStakeInput = {
  id: Scalars['ID'];
};

export type DeleteUserTokensInput = {
  id: Scalars['ID'];
};

export type DeleteVoterRewardsHistoryInput = {
  id: Scalars['ID'];
};

/** Represents a Domain within the Colony Network */
export type Domain = {
  __typename?: 'Domain';
  /** Colony associated with the Domain */
  colony: Colony;
  /** Colony ID associated with the Domain */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /**
   * Unique identifier for the Domain
   * This should be in the following format: `colonyAddress_nativeId`
   * The native id is the auto-incrementing integer that is assigned to a domain from the contract on creation
   */
  id: Scalars['ID'];
  /** Indicates whether the Domain is the root domain (ID 1) */
  isRoot: Scalars['Boolean'];
  /** Metadata of the Domain */
  metadata?: Maybe<DomainMetadata>;
  /**
   * Native funding pot ID of the Domain
   * The native funding pot ID is assigned to a domain from the contract on creation
   */
  nativeFundingPotId: Scalars['Int'];
  /**
   * Native ID of the Domain
   * The native id is the auto-incrementing integer that is assigned to a domain from the contract on creation
   */
  nativeId: Scalars['Int'];
  /**
   * Native skill ID of the Domain
   * The native skill ID is assigned to a domain from the contract on creation
   */
  nativeSkillId: Scalars['String'];
  /** The amount of reputation in the domain */
  reputation?: Maybe<Scalars['String']>;
  /** The amount of reputation in the domain, as a percentage of the total in the colony */
  reputationPercentage?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
};

/** Input data for fetching domain balance in/out values within a specific timeframe */
export type DomainBalanceArguments = {
  /** Address of the colony on the blockchain */
  colonyAddress: Scalars['String'];
  /** Domain id within a colony */
  domainId?: InputMaybe<Scalars['String']>;
  /** This is a unique identifier to distinguish between the triggered queries and make query aborting more predictable */
  queryRunId?: InputMaybe<Scalars['String']>;
  /** The currency in which we want to exchange the in/out token balance */
  selectedCurrency?: InputMaybe<ExtendedSupportedCurrencies>;
  /** The timeframe period for which we want to get the in/out token balance */
  timeframePeriod: Scalars['Int'];
  /**
   * The timeframe period end date until which we want to compute the in/out token balance
   * Default to Date.now()
   */
  timeframePeriodEndDate?: InputMaybe<Scalars['AWSDateTime']>;
  /**
   * The timeframe type (day/week/month/total) for which we want to get the in/out token balance
   * Defaults to TimeframeType.MONTHLY
   */
  timeframeType?: InputMaybe<TimeframeType>;
};

/** Return type for domain balance in/out values */
export type DomainBalanceInOut = {
  __typename?: 'DomainBalanceInOut';
  /** The totalIn - totalOut value */
  total?: Maybe<Scalars['String']>;
  totalIn?: Maybe<Scalars['String']>;
  totalOut?: Maybe<Scalars['String']>;
};

/** Return type for domain balance */
export type DomainBalanceReturn = {
  __typename?: 'DomainBalanceReturn';
  timeframe?: Maybe<Array<Maybe<TimeframeDomainBalanceInOut>>>;
  /** The totalIn - totalOut value */
  total?: Maybe<Scalars['String']>;
  totalIn?: Maybe<Scalars['String']>;
  totalOut?: Maybe<Scalars['String']>;
};

/** Variants of available domain colors as used in the dApp */
export enum DomainColor {
  /** An aqua color */
  Aqua = 'AQUA',
  /** A black color */
  Black = 'BLACK',
  /** A blue color */
  Blue = 'BLUE',
  /** A blue-grey(ish) color */
  BlueGrey = 'BLUE_GREY',
  /** An emerald green color */
  EmeraldGreen = 'EMERALD_GREEN',
  /** A gold color */
  Gold = 'GOLD',
  /** A green color */
  Green = 'GREEN',
  /** A light pink color */
  LightPink = 'LIGHT_PINK',
  /** A magenta color */
  Magenta = 'MAGENTA',
  /** An orange color */
  Orange = 'ORANGE',
  /** A pale indigo color */
  Periwinkle = 'PERIWINKLE',
  /** A pink color */
  Pink = 'PINK',
  /** A purple color */
  Purple = 'PURPLE',
  /** A purple-grey(ish) color */
  PurpleGrey = 'PURPLE_GREY',
  /** A red color */
  Red = 'RED',
  /** The default domain color for the root domain. Only used by the root by default and cannot be selected by the user. */
  Root = 'ROOT',
  /** A yellow color */
  Yellow = 'YELLOW',
}

/** Input type for specifying a Domain */
export type DomainInput = {
  /** Unique identifier for the Domain */
  id: Scalars['ID'];
};

/** Represents metadata for a Domain */
export type DomainMetadata = {
  __typename?: 'DomainMetadata';
  /** List of Domain metadata changelog entries */
  changelog?: Maybe<Array<DomainMetadataChangelog>>;
  /** Color associated with the Domain */
  color: DomainColor;
  createdAt: Scalars['AWSDateTime'];
  /** Description of the Domain */
  description?: Maybe<Scalars['String']>;
  /**
   * Unique identifier for the Domain metadata
   * This field is referenced by Domain id, so has to be in the same format: colonyAddress_nativeId
   */
  id: Scalars['ID'];
  /** Name of the Domain */
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents a changelog entry for Domain metadata */
export type DomainMetadataChangelog = {
  __typename?: 'DomainMetadataChangelog';
  /** Color of the Domain after the change */
  newColor: DomainColor;
  /** Description of the Domain after the change */
  newDescription?: Maybe<Scalars['String']>;
  /** Name of the Domain after the change */
  newName: Scalars['String'];
  /** Color of the Domain before the change */
  oldColor: DomainColor;
  /** Description of the Domain before the change */
  oldDescription?: Maybe<Scalars['String']>;
  /** Name of the Domain before the change */
  oldName: Scalars['String'];
  /** Transaction hash associated with the changelog entry */
  transactionHash: Scalars['String'];
};

export type DomainMetadataChangelogInput = {
  newColor: DomainColor;
  newDescription?: InputMaybe<Scalars['String']>;
  newName: Scalars['String'];
  oldColor: DomainColor;
  oldDescription?: InputMaybe<Scalars['String']>;
  oldName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type Expenditure = {
  __typename?: 'Expenditure';
  actions?: Maybe<ModelColonyActionConnection>;
  /** Array containing balances of tokens in the expenditure */
  balances?: Maybe<Array<ExpenditureBalance>>;
  /** The Colony to which the expenditure belongs */
  colony: Colony;
  /** Colony ID (address) to which the expenditure belongs */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** The timestamp at which the expenditure was finalized */
  finalizedAt?: Maybe<Scalars['AWSTimestamp']>;
  /** Hash of the first transaction that contained ExpenditurePayoutSet event */
  firstEditTransactionHash?: Maybe<Scalars['String']>;
  /**
   * Unique identifier for the role snapshot
   * Self-managed, format: `colonyId_nativeExpenditureId`
   */
  id: Scalars['ID'];
  /** Indicates whether the expenditure was staked for */
  isStaked: Scalars['Boolean'];
  /**
   * Optional metadata linked to the expenditure
   * It contains client-side data that is not stored on chain
   */
  metadata?: Maybe<ExpenditureMetadata>;
  motions?: Maybe<ModelColonyMotionConnection>;
  /** Native (contract) ID of the expenditure domain */
  nativeDomainId: Scalars['Int'];
  /** Native (contract) ID of the funding pot of the expenditure */
  nativeFundingPotId: Scalars['Int'];
  /** Native (contract) ID of the expenditure */
  nativeId: Scalars['Int'];
  /** Address of the expenditure owner, it can be a user or an extension */
  ownerAddress: Scalars['ID'];
  /** Array containing expenditure slots */
  slots: Array<ExpenditureSlot>;
  /** Only used for Split Payments, used to prevent sending multiple payment notifications */
  splitPaymentPayoutClaimedNotificationSent?: Maybe<Scalars['Boolean']>;
  /** Address of StagedExpenditure extension which set the expenditure as staged, if applicable */
  stagedExpenditureAddress?: Maybe<Scalars['ID']>;
  /** Address of StakedExpenditure extension which created the expenditure, if applicable */
  stakedExpenditureAddress?: Maybe<Scalars['ID']>;
  /** Status of the expenditure */
  status: ExpenditureStatus;
  type: ExpenditureType;
  updatedAt: Scalars['AWSDateTime'];
  /** User stake associated with the expenditure, if any */
  userStake?: Maybe<UserStake>;
  /** ID of the user stake associated with the expenditure, if any */
  userStakeId?: Maybe<Scalars['ID']>;
};

export type ExpenditureActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ExpenditureMotionsArgs = {
  filter?: InputMaybe<ModelColonyMotionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ExpenditureBalance = {
  __typename?: 'ExpenditureBalance';
  amount: Scalars['String'];
  tokenAddress: Scalars['ID'];
};

export type ExpenditureBalanceInput = {
  amount: Scalars['String'];
  tokenAddress: Scalars['ID'];
};

export type ExpenditureFundingItem = {
  __typename?: 'ExpenditureFundingItem';
  /** The amount of the token to be funded */
  amount: Scalars['String'];
  /** The token address of the token to be funded */
  tokenAddress: Scalars['String'];
};

export type ExpenditureFundingItemInput = {
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type ExpenditureMetadata = {
  __typename?: 'ExpenditureMetadata';
  createdAt: Scalars['AWSDateTime'];
  /**
   * Specifies the distribution type selected when creating a split payment
   * Will be null for other payment types
   */
  distributionType?: Maybe<SplitPaymentDistributionType>;
  expectedNumberOfPayouts?: Maybe<Scalars['Int']>;
  expectedNumberOfTokens?: Maybe<Scalars['Int']>;
  fundFromDomainNativeId: Scalars['Int'];
  id: Scalars['ID'];
  stages?: Maybe<Array<ExpenditureStage>>;
  updatedAt: Scalars['AWSDateTime'];
};

export type ExpenditurePayout = {
  __typename?: 'ExpenditurePayout';
  /** Payout amount, excluding network fee */
  amount: Scalars['String'];
  isClaimed: Scalars['Boolean'];
  /**
   * Network fee amount
   * @TODO: Make this a non-nullable field once existing data is updated
   */
  networkFee?: Maybe<Scalars['String']>;
  tokenAddress: Scalars['ID'];
};

export type ExpenditurePayoutInput = {
  amount: Scalars['String'];
  isClaimed: Scalars['Boolean'];
  networkFee?: InputMaybe<Scalars['String']>;
  tokenAddress: Scalars['ID'];
};

/**
 * Represents a slot of an expenditure
 * Each expenditure can have multiple slots, with a single recipients and multiple payouts (in different token addresses)
 */
export type ExpenditureSlot = {
  __typename?: 'ExpenditureSlot';
  /** Slot claim delay (in seconds) */
  claimDelay?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  payoutModifier?: Maybe<Scalars['Int']>;
  payouts?: Maybe<Array<ExpenditurePayout>>;
  recipientAddress?: Maybe<Scalars['String']>;
};

export type ExpenditureSlotChanges = {
  __typename?: 'ExpenditureSlotChanges';
  newSlots: Array<ExpenditureSlot>;
  oldSlots: Array<ExpenditureSlot>;
};

export type ExpenditureSlotChangesInput = {
  newSlots: Array<ExpenditureSlotInput>;
  oldSlots: Array<ExpenditureSlotInput>;
};

export type ExpenditureSlotInput = {
  claimDelay?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  payoutModifier?: InputMaybe<Scalars['Int']>;
  payouts?: InputMaybe<Array<ExpenditurePayoutInput>>;
  recipientAddress?: InputMaybe<Scalars['String']>;
};

export type ExpenditureStage = {
  __typename?: 'ExpenditureStage';
  name: Scalars['String'];
  slotId: Scalars['Int'];
};

export type ExpenditureStageInput = {
  name: Scalars['String'];
  slotId: Scalars['Int'];
};

export enum ExpenditureStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Finalized = 'FINALIZED',
  Locked = 'LOCKED',
}

export enum ExpenditureType {
  PaymentBuilder = 'PAYMENT_BUILDER',
  Staged = 'STAGED',
}

export enum ExtendedSupportedCurrencies {
  Brl = 'BRL',
  Cad = 'CAD',
  Clny = 'CLNY',
  Eth = 'ETH',
  Eur = 'EUR',
  Gbp = 'GBP',
  Inr = 'INR',
  Jpy = 'JPY',
  Krw = 'KRW',
  Usd = 'USD',
  Usdc = 'USDC',
}

export type ExtensionInstallationsCount = {
  __typename?: 'ExtensionInstallationsCount';
  createdAt: Scalars['AWSDateTime'];
  /** The model id. It's the chain id the of the colony the extension belongs to */
  id: Scalars['ID'];
  multiSigPermissions: Scalars['Int'];
  oneTxPayment: Scalars['Int'];
  reputationWeighted: Scalars['Int'];
  stagedExpenditure: Scalars['Int'];
  stakedExpenditure: Scalars['Int'];
  streamingPayments: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Map of parameters that extensions are initialised with */
export type ExtensionParams = {
  __typename?: 'ExtensionParams';
  /** Params for MultiSig */
  multiSig?: Maybe<MultiSigParams>;
  /** Initialization parameters for the `StakedExpenditure` extension */
  stakedExpenditure?: Maybe<StakedExpenditureParams>;
  /** Initialization parameters for the `VotingReputation` extension */
  votingReputation?: Maybe<VotingReputationParams>;
};

export type ExtensionParamsInput = {
  multiSig?: InputMaybe<MultiSigParamsInput>;
  stakedExpenditure?: InputMaybe<StakedExpenditureParamsInput>;
  votingReputation?: InputMaybe<VotingReputationParamsInput>;
};

export type ExternalLink = {
  __typename?: 'ExternalLink';
  link: Scalars['String'];
  name: ExternalLinks;
};

export type ExternalLinkInput = {
  link: Scalars['String'];
  name: ExternalLinks;
};

export enum ExternalLinks {
  Custom = 'Custom',
  Discord = 'Discord',
  Facebook = 'Facebook',
  Github = 'Github',
  Instagram = 'Instagram',
  Telegram = 'Telegram',
  Twitter = 'Twitter',
  Whitepaper = 'Whitepaper',
  Youtube = 'Youtube',
}

export type FailedTransaction = {
  __typename?: 'FailedTransaction';
  /** Transaction id */
  id: Scalars['ID'];
  /** The current status of the transaction */
  status: TransactionStatus;
};

export enum FilteringMethod {
  /** Apply an intersection filter */
  Intersection = 'INTERSECTION',
  /** Apply a union filter */
  Union = 'UNION',
}

export type FunctionParam = {
  __typename?: 'FunctionParam';
  name: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type FunctionParamInput = {
  name: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

/** Input data for retrieving the state of a motion (i.e. the current period) */
export type GetMotionStateInput = {
  /** The Ethereum address of the Colony */
  colonyAddress: Scalars['String'];
  /** The internal id of the motion in the database */
  databaseMotionId: Scalars['String'];
};

/** Input data for retrieving the timeout of the current period the motion is in */
export type GetMotionTimeoutPeriodsInput = {
  /** The Ethereum address of the user who voted */
  colonyAddress: Scalars['String'];
  /** The on chain id of the motion */
  motionId: Scalars['String'];
};

/**
 * A return type that contains the timeout periods the motion can be in
 * Represented via a string-integer in milliseconds. Will report 0 for periods that are elapsed and will show the accumulated time for later periods
 */
export type GetMotionTimeoutPeriodsReturn = {
  __typename?: 'GetMotionTimeoutPeriodsReturn';
  /** Time left in escalation period */
  timeLeftToEscalate: Scalars['String'];
  /** Time left in reveal period */
  timeLeftToReveal: Scalars['String'];
  /** Time left in staking period */
  timeLeftToStake: Scalars['String'];
  /** Time left in voting period */
  timeLeftToVote: Scalars['String'];
};

export type GetSafeTransactionStatusInput = {
  chainId: Scalars['String'];
  transactionHash: Scalars['String'];
};

/**
 * Input data for a user's reputation within a Domain in a Colony. If no `domainId` is passed, the Root Domain is used
 * A `rootHash` can be provided, to get reputation at a certain point in the past
 */
export type GetUserReputationInput = {
  /** The Ethereum address of the Colony */
  colonyAddress: Scalars['String'];
  /** The ID of the Domain within the Colony. If not provided, defaults to the Root Domain */
  domainId?: InputMaybe<Scalars['Int']>;
  /** The root hash of the reputation tree at a specific point in time */
  rootHash?: InputMaybe<Scalars['String']>;
  /** The Ethereum wallet address of the user */
  walletAddress: Scalars['String'];
};

/** Input data for retrieving a user's token balance for a specific token */
export type GetUserTokenBalanceInput = {
  /** The Colony address */
  colonyAddress: Scalars['String'];
  /** The address of the token */
  tokenAddress: Scalars['String'];
  /** The wallet address of the user */
  walletAddress: Scalars['String'];
};

/** A return type representing the breakdown of a user's token balance */
export type GetUserTokenBalanceReturn = {
  __typename?: 'GetUserTokenBalanceReturn';
  /**
   * The active portion of the user's token balance
   * This is the balance that is approved for the Colony Network to use (e.g. for governance)
   */
  activeBalance?: Maybe<Scalars['String']>;
  /** The total token balance, including inactive, locked, and active balances */
  balance?: Maybe<Scalars['String']>;
  /**
   * The inactive portion of the user's token balance
   * This is the balance of a token that is in a users wallet but can't be used by the Colony Network (e.g. for governance)
   */
  inactiveBalance?: Maybe<Scalars['String']>;
  /**
   * The locked portion of the user's token balance
   * This is the balance of a token that is staked (e.g. in motions)
   */
  lockedBalance?: Maybe<Scalars['String']>;
  /**
   * The pending portion of the user's token balance
   * These are tokens that have been sent to the wallet, but are inaccessible until all locks are cleared and then these tokens are claimed
   */
  pendingBalance?: Maybe<Scalars['String']>;
};

/** Input data for retrieving the voting rewards for a user within a finished motion */
export type GetVoterRewardsInput = {
  /** The Ethereum address of the Colony */
  colonyAddress: Scalars['String'];
  /** The on chain id of the motion */
  motionId: Scalars['String'];
  /** The on chain id of the domain in which the motion was created */
  nativeMotionDomainId: Scalars['String'];
  /** The root hash of the reputation tree at the time the motion was created */
  rootHash: Scalars['String'];
  /** The Ethereum address of the user who voted */
  voterAddress: Scalars['String'];
};

/** Model storing block ingestor stats, as key-value entries */
export type IngestorStats = {
  __typename?: 'IngestorStats';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier of the ingestor stats */
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  /** JSON string to pass custom, dynamic values */
  value: Scalars['String'];
};

export type InitializeUserInput = {
  /** The user's wallet address */
  userAddress: Scalars['ID'];
};

export type InitializeUserReturn = {
  __typename?: 'InitializeUserReturn';
  failedTransactions: Array<FailedTransaction>;
};

export enum KycStatus {
  Approved = 'APPROVED',
  Incomplete = 'INCOMPLETE',
  NotStarted = 'NOT_STARTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  UnderReview = 'UNDER_REVIEW',
}

/**
 * NOTE: This model should only be used to lookup users by liquidation address
 * To get the liquidation address of a user, use the `bridgeGetUserLiquidationAddress` query instead
 */
export type LiquidationAddress = {
  __typename?: 'LiquidationAddress';
  /** The chain id the colony is on */
  chainId: Scalars['Int'];
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the liquidation address entry */
  id: Scalars['ID'];
  /** The liquidation address */
  liquidationAddress: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  /** The user associated */
  user?: Maybe<User>;
  /** The user address associated */
  userAddress: Scalars['ID'];
};

/** Represents a market price exchange rate for a specific currency */
export type MarketPrice = {
  __typename?: 'MarketPrice';
  currency: SupportedCurrencies;
  rate?: Maybe<Scalars['Float']>;
};

export type MarketPriceInput = {
  currency: SupportedCurrencies;
  rate?: InputMaybe<Scalars['Float']>;
};

export type ModelAnnotationConditionInput = {
  actionId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelAnnotationConditionInput>>>;
  ipfsHash?: InputMaybe<ModelStringInput>;
  message?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAnnotationConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAnnotationConditionInput>>>;
};

export type ModelAnnotationConnection = {
  __typename?: 'ModelAnnotationConnection';
  items: Array<Maybe<Annotation>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelAnnotationFilterInput = {
  actionId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelAnnotationFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  ipfsHash?: InputMaybe<ModelStringInput>;
  message?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAnnotationFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAnnotationFilterInput>>>;
};

export enum ModelAttributeTypes {
  Null = '_null',
  Binary = 'binary',
  BinarySet = 'binarySet',
  Bool = 'bool',
  List = 'list',
  Map = 'map',
  Number = 'number',
  NumberSet = 'numberSet',
  String = 'string',
  StringSet = 'stringSet',
}

export type ModelBooleanInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export type ModelCacheTotalBalanceConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCacheTotalBalanceConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  date?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCacheTotalBalanceConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCacheTotalBalanceConditionInput>>>;
  timeframePeriod?: InputMaybe<ModelIntInput>;
  timeframeType?: InputMaybe<ModelTimeframeTypeInput>;
  totalUSDC?: InputMaybe<ModelStringInput>;
  totalUSDCIn?: InputMaybe<ModelStringInput>;
  totalUSDCOut?: InputMaybe<ModelStringInput>;
};

export type ModelCacheTotalBalanceConnection = {
  __typename?: 'ModelCacheTotalBalanceConnection';
  items: Array<Maybe<CacheTotalBalance>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelCacheTotalBalanceFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCacheTotalBalanceFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  date?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelCacheTotalBalanceFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCacheTotalBalanceFilterInput>>>;
  timeframePeriod?: InputMaybe<ModelIntInput>;
  timeframeType?: InputMaybe<ModelTimeframeTypeInput>;
  totalUSDC?: InputMaybe<ModelStringInput>;
  totalUSDCIn?: InputMaybe<ModelStringInput>;
  totalUSDCOut?: InputMaybe<ModelStringInput>;
};

export type ModelClientTypeInput = {
  eq?: InputMaybe<ClientType>;
  ne?: InputMaybe<ClientType>;
};

export type ModelColonyActionConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionConditionInput>>>;
  annotationId?: InputMaybe<ModelIdInput>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyDecisionId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  expenditureId?: InputMaybe<ModelIdInput>;
  expenditureSlotIds?: InputMaybe<ModelIntInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fromPotId?: InputMaybe<ModelIntInput>;
  individualEvents?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  isMotionFinalization?: InputMaybe<ModelBooleanInput>;
  isMultiSig?: InputMaybe<ModelBooleanInput>;
  members?: InputMaybe<ModelIdInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  motionId?: InputMaybe<ModelIdInput>;
  multiSigId?: InputMaybe<ModelIdInput>;
  networkFee?: InputMaybe<ModelStringInput>;
  newColonyVersion?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyActionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionConditionInput>>>;
  paymentId?: InputMaybe<ModelIntInput>;
  pendingColonyMetadataId?: InputMaybe<ModelIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelIdInput>;
  recipientAddress?: InputMaybe<ModelIdInput>;
  rolesAreMultiSig?: InputMaybe<ModelBooleanInput>;
  rootHash?: InputMaybe<ModelStringInput>;
  showInActionsList?: InputMaybe<ModelBooleanInput>;
  toDomainId?: InputMaybe<ModelIdInput>;
  toPotId?: InputMaybe<ModelIntInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelColonyActionTypeInput>;
};

export type ModelColonyActionConnection = {
  __typename?: 'ModelColonyActionConnection';
  items: Array<Maybe<ColonyAction>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyActionFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionFilterInput>>>;
  annotationId?: InputMaybe<ModelIdInput>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyDecisionId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  expenditureId?: InputMaybe<ModelIdInput>;
  expenditureSlotIds?: InputMaybe<ModelIntInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fromPotId?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  individualEvents?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  isMotionFinalization?: InputMaybe<ModelBooleanInput>;
  isMultiSig?: InputMaybe<ModelBooleanInput>;
  members?: InputMaybe<ModelIdInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  motionId?: InputMaybe<ModelIdInput>;
  multiSigId?: InputMaybe<ModelIdInput>;
  networkFee?: InputMaybe<ModelStringInput>;
  newColonyVersion?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyActionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionFilterInput>>>;
  paymentId?: InputMaybe<ModelIntInput>;
  pendingColonyMetadataId?: InputMaybe<ModelIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelIdInput>;
  recipientAddress?: InputMaybe<ModelIdInput>;
  rolesAreMultiSig?: InputMaybe<ModelBooleanInput>;
  rootHash?: InputMaybe<ModelStringInput>;
  showInActionsList?: InputMaybe<ModelBooleanInput>;
  toDomainId?: InputMaybe<ModelIdInput>;
  toPotId?: InputMaybe<ModelIntInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelColonyActionTypeInput>;
};

export type ModelColonyActionMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionMetadataConditionInput>>>;
  customTitle?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyActionMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionMetadataConditionInput>>>;
};

export type ModelColonyActionMetadataConnection = {
  __typename?: 'ModelColonyActionMetadataConnection';
  items: Array<Maybe<ColonyActionMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyActionMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionMetadataFilterInput>>>;
  customTitle?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyActionMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionMetadataFilterInput>>>;
};

export type ModelColonyActionTypeInput = {
  eq?: InputMaybe<ColonyActionType>;
  ne?: InputMaybe<ColonyActionType>;
};

export type ModelColonyConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyConditionInput>>>;
  colonyMemberInviteCode?: InputMaybe<ModelIdInput>;
  createdAtBlock?: InputMaybe<ModelIntInput>;
  expendituresGlobalClaimDelay?: InputMaybe<ModelStringInput>;
  lastUpdatedContributorsWithReputation?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  nativeTokenId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyConditionInput>>>;
  private?: InputMaybe<ModelBooleanInput>;
  reputation?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelColonyTypeInput>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyConnection = {
  __typename?: 'ModelColonyConnection';
  items: Array<Maybe<Colony>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyContributorConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyContributorConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  colonyReputationPercentage?: InputMaybe<ModelFloatInput>;
  contributorAddress?: InputMaybe<ModelIdInput>;
  hasPermissions?: InputMaybe<ModelBooleanInput>;
  hasReputation?: InputMaybe<ModelBooleanInput>;
  isVerified?: InputMaybe<ModelBooleanInput>;
  isWatching?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyContributorConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyContributorConditionInput>>>;
  type?: InputMaybe<ModelContributorTypeInput>;
};

export type ModelColonyContributorConnection = {
  __typename?: 'ModelColonyContributorConnection';
  items: Array<Maybe<ColonyContributor>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyContributorFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyContributorFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  colonyReputationPercentage?: InputMaybe<ModelFloatInput>;
  contributorAddress?: InputMaybe<ModelIdInput>;
  hasPermissions?: InputMaybe<ModelBooleanInput>;
  hasReputation?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  isVerified?: InputMaybe<ModelBooleanInput>;
  isWatching?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyContributorFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyContributorFilterInput>>>;
  type?: InputMaybe<ModelContributorTypeInput>;
};

export type ModelColonyDecisionConditionInput = {
  actionId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyDecisionConditionInput>>>;
  colonyAddress?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyDecisionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyDecisionConditionInput>>>;
  showInDecisionsList?: InputMaybe<ModelBooleanInput>;
  title?: InputMaybe<ModelStringInput>;
  walletAddress?: InputMaybe<ModelStringInput>;
};

export type ModelColonyDecisionConnection = {
  __typename?: 'ModelColonyDecisionConnection';
  items: Array<Maybe<ColonyDecision>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyDecisionFilterInput = {
  actionId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyDecisionFilterInput>>>;
  colonyAddress?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyDecisionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyDecisionFilterInput>>>;
  showInDecisionsList?: InputMaybe<ModelBooleanInput>;
  title?: InputMaybe<ModelStringInput>;
  walletAddress?: InputMaybe<ModelStringInput>;
};

export type ModelColonyExtensionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyExtensionConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  hash?: InputMaybe<ModelStringInput>;
  installedAt?: InputMaybe<ModelIntInput>;
  installedBy?: InputMaybe<ModelStringInput>;
  isDeleted?: InputMaybe<ModelBooleanInput>;
  isDeprecated?: InputMaybe<ModelBooleanInput>;
  isInitialized?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyExtensionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyExtensionConditionInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyExtensionConnection = {
  __typename?: 'ModelColonyExtensionConnection';
  items: Array<Maybe<ColonyExtension>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyExtensionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyExtensionFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  hash?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  installedAt?: InputMaybe<ModelIntInput>;
  installedBy?: InputMaybe<ModelStringInput>;
  isDeleted?: InputMaybe<ModelBooleanInput>;
  isDeprecated?: InputMaybe<ModelBooleanInput>;
  isInitialized?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyExtensionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyExtensionFilterInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyFilterInput>>>;
  colonyMemberInviteCode?: InputMaybe<ModelIdInput>;
  createdAtBlock?: InputMaybe<ModelIntInput>;
  expendituresGlobalClaimDelay?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  lastUpdatedContributorsWithReputation?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  nativeTokenId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFilterInput>>>;
  private?: InputMaybe<ModelBooleanInput>;
  reputation?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelColonyTypeInput>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyFundsClaimConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimConditionInput>>>;
  colonyFundsClaimTokenId?: InputMaybe<ModelIdInput>;
  colonyFundsClaimsId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  createdAtBlock?: InputMaybe<ModelIntInput>;
  isClaimed?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimConditionInput>>>;
};

export type ModelColonyFundsClaimConnection = {
  __typename?: 'ModelColonyFundsClaimConnection';
  items: Array<Maybe<ColonyFundsClaim>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyFundsClaimFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimFilterInput>>>;
  colonyFundsClaimTokenId?: InputMaybe<ModelIdInput>;
  colonyFundsClaimsId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  createdAtBlock?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  isClaimed?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimFilterInput>>>;
};

export type ModelColonyHistoricRoleConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleConditionInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelIdInput>;
  isMultiSig?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleConditionInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelStringInput>;
};

export type ModelColonyHistoricRoleConnection = {
  __typename?: 'ModelColonyHistoricRoleConnection';
  items: Array<Maybe<ColonyHistoricRole>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyHistoricRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleFilterInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  isMultiSig?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleFilterInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMemberInviteConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMemberInviteConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  invitesRemaining?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyMemberInviteConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMemberInviteConditionInput>>>;
};

export type ModelColonyMemberInviteConnection = {
  __typename?: 'ModelColonyMemberInviteConnection';
  items: Array<Maybe<ColonyMemberInvite>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMemberInviteFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMemberInviteFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  invitesRemaining?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyMemberInviteFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMemberInviteFilterInput>>>;
};

export type ModelColonyMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMetadataConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMetadataConditionInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMetadataConnection = {
  __typename?: 'ModelColonyMetadataConnection';
  items: Array<Maybe<ColonyMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMetadataFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMetadataFilterInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMotionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMotionConditionInput>>>;
  createdBy?: InputMaybe<ModelStringInput>;
  expenditureId?: InputMaybe<ModelIdInput>;
  expenditureSlotIds?: InputMaybe<ModelIntInput>;
  hasObjection?: InputMaybe<ModelBooleanInput>;
  isDecision?: InputMaybe<ModelBooleanInput>;
  isFinalized?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelStringInput>;
  nativeMotionId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMotionConditionInput>;
  objectionAnnotationId?: InputMaybe<ModelIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMotionConditionInput>>>;
  remainingStakes?: InputMaybe<ModelStringInput>;
  repSubmitted?: InputMaybe<ModelStringInput>;
  requiredStake?: InputMaybe<ModelStringInput>;
  skillRep?: InputMaybe<ModelStringInput>;
  transactionHash?: InputMaybe<ModelIdInput>;
  userMinStake?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMotionConnection = {
  __typename?: 'ModelColonyMotionConnection';
  items: Array<Maybe<ColonyMotion>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMotionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMotionFilterInput>>>;
  createdBy?: InputMaybe<ModelStringInput>;
  expenditureId?: InputMaybe<ModelIdInput>;
  expenditureSlotIds?: InputMaybe<ModelIntInput>;
  hasObjection?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  isDecision?: InputMaybe<ModelBooleanInput>;
  isFinalized?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelStringInput>;
  nativeMotionId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMotionFilterInput>;
  objectionAnnotationId?: InputMaybe<ModelIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMotionFilterInput>>>;
  remainingStakes?: InputMaybe<ModelStringInput>;
  repSubmitted?: InputMaybe<ModelStringInput>;
  requiredStake?: InputMaybe<ModelStringInput>;
  skillRep?: InputMaybe<ModelStringInput>;
  transactionHash?: InputMaybe<ModelIdInput>;
  userMinStake?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMultiSigConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMultiSigConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  executedAt?: InputMaybe<ModelStringInput>;
  executedBy?: InputMaybe<ModelIdInput>;
  expenditureId?: InputMaybe<ModelIdInput>;
  hasActionCompleted?: InputMaybe<ModelBooleanInput>;
  isDecision?: InputMaybe<ModelBooleanInput>;
  isExecuted?: InputMaybe<ModelBooleanInput>;
  isRejected?: InputMaybe<ModelBooleanInput>;
  multiSigDomainId?: InputMaybe<ModelIdInput>;
  nativeMultiSigDomainId?: InputMaybe<ModelStringInput>;
  nativeMultiSigId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyMultiSigConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMultiSigConditionInput>>>;
  rejectedAt?: InputMaybe<ModelStringInput>;
  rejectedBy?: InputMaybe<ModelIdInput>;
  requiredPermissions?: InputMaybe<ModelIntInput>;
  transactionHash?: InputMaybe<ModelIdInput>;
};

export type ModelColonyMultiSigConnection = {
  __typename?: 'ModelColonyMultiSigConnection';
  items: Array<Maybe<ColonyMultiSig>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMultiSigFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMultiSigFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  executedAt?: InputMaybe<ModelStringInput>;
  executedBy?: InputMaybe<ModelIdInput>;
  expenditureId?: InputMaybe<ModelIdInput>;
  hasActionCompleted?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  isDecision?: InputMaybe<ModelBooleanInput>;
  isExecuted?: InputMaybe<ModelBooleanInput>;
  isRejected?: InputMaybe<ModelBooleanInput>;
  multiSigDomainId?: InputMaybe<ModelIdInput>;
  nativeMultiSigDomainId?: InputMaybe<ModelStringInput>;
  nativeMultiSigId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyMultiSigFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMultiSigFilterInput>>>;
  rejectedAt?: InputMaybe<ModelStringInput>;
  rejectedBy?: InputMaybe<ModelIdInput>;
  requiredPermissions?: InputMaybe<ModelIntInput>;
  transactionHash?: InputMaybe<ModelIdInput>;
};

export type ModelColonyRoleConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyRoleConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  colonyRolesId?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  isMultiSig?: InputMaybe<ModelBooleanInput>;
  latestBlock?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyRoleConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyRoleConditionInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
};

export type ModelColonyRoleConnection = {
  __typename?: 'ModelColonyRoleConnection';
  items: Array<Maybe<ColonyRole>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyRoleFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  colonyRolesId?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  isMultiSig?: InputMaybe<ModelBooleanInput>;
  latestBlock?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyRoleFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyRoleFilterInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
};

export type ModelColonyTokensConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyTokensConditionInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyTokensConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyTokensConditionInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
};

export type ModelColonyTokensConnection = {
  __typename?: 'ModelColonyTokensConnection';
  items: Array<Maybe<ColonyTokens>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyTokensFilterInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyTokensFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
};

export type ModelColonyTypeInput = {
  eq?: InputMaybe<ColonyType>;
  ne?: InputMaybe<ColonyType>;
};

export type ModelContractEventConditionInput = {
  agent?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelContractEventConditionInput>>>;
  contractEventColonyId?: InputMaybe<ModelIdInput>;
  contractEventDomainId?: InputMaybe<ModelIdInput>;
  contractEventTokenId?: InputMaybe<ModelIdInput>;
  contractEventUserId?: InputMaybe<ModelIdInput>;
  encodedArguments?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelContractEventConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelContractEventConditionInput>>>;
  signature?: InputMaybe<ModelStringInput>;
  target?: InputMaybe<ModelStringInput>;
};

export type ModelContractEventConnection = {
  __typename?: 'ModelContractEventConnection';
  items: Array<Maybe<ContractEvent>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelContractEventFilterInput = {
  agent?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelContractEventFilterInput>>>;
  contractEventColonyId?: InputMaybe<ModelIdInput>;
  contractEventDomainId?: InputMaybe<ModelIdInput>;
  contractEventTokenId?: InputMaybe<ModelIdInput>;
  contractEventUserId?: InputMaybe<ModelIdInput>;
  encodedArguments?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelContractEventFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelContractEventFilterInput>>>;
  signature?: InputMaybe<ModelStringInput>;
  target?: InputMaybe<ModelStringInput>;
};

export type ModelContributorReputationConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelContributorReputationConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  contributorAddress?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelContributorReputationConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelContributorReputationConditionInput>>>;
  reputationPercentage?: InputMaybe<ModelFloatInput>;
  reputationRaw?: InputMaybe<ModelStringInput>;
};

export type ModelContributorReputationConnection = {
  __typename?: 'ModelContributorReputationConnection';
  items: Array<Maybe<ContributorReputation>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelContributorReputationFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelContributorReputationFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  contributorAddress?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelContributorReputationFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelContributorReputationFilterInput>>>;
  reputationPercentage?: InputMaybe<ModelFloatInput>;
  reputationRaw?: InputMaybe<ModelStringInput>;
};

export type ModelContributorTypeInput = {
  eq?: InputMaybe<ContributorType>;
  ne?: InputMaybe<ContributorType>;
};

export type ModelCurrentNetworkInverseFeeConditionInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>>
  >;
  inverseFee?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>>
  >;
};

export type ModelCurrentNetworkInverseFeeConnection = {
  __typename?: 'ModelCurrentNetworkInverseFeeConnection';
  items: Array<Maybe<CurrentNetworkInverseFee>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelCurrentNetworkInverseFeeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  inverseFee?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>>>;
};

export type ModelCurrentVersionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentVersionConditionInput>>>;
  key?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentVersionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentVersionConditionInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelCurrentVersionConnection = {
  __typename?: 'ModelCurrentVersionConnection';
  items: Array<Maybe<CurrentVersion>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelCurrentVersionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentVersionFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  key?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentVersionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentVersionFilterInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelDomainColorInput = {
  eq?: InputMaybe<DomainColor>;
  ne?: InputMaybe<DomainColor>;
};

export type ModelDomainConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  isRoot?: InputMaybe<ModelBooleanInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  nativeSkillId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelDomainConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainConditionInput>>>;
  reputation?: InputMaybe<ModelStringInput>;
  reputationPercentage?: InputMaybe<ModelStringInput>;
};

export type ModelDomainConnection = {
  __typename?: 'ModelDomainConnection';
  items: Array<Maybe<Domain>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelDomainFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  isRoot?: InputMaybe<ModelBooleanInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  nativeSkillId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelDomainFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainFilterInput>>>;
  reputation?: InputMaybe<ModelStringInput>;
  reputationPercentage?: InputMaybe<ModelStringInput>;
};

export type ModelDomainMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainMetadataConditionInput>>>;
  color?: InputMaybe<ModelDomainColorInput>;
  description?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelDomainMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainMetadataConditionInput>>>;
};

export type ModelDomainMetadataConnection = {
  __typename?: 'ModelDomainMetadataConnection';
  items: Array<Maybe<DomainMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelDomainMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainMetadataFilterInput>>>;
  color?: InputMaybe<ModelDomainColorInput>;
  description?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelDomainMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainMetadataFilterInput>>>;
};

export type ModelExpenditureConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelExpenditureConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  finalizedAt?: InputMaybe<ModelIntInput>;
  firstEditTransactionHash?: InputMaybe<ModelStringInput>;
  isStaked?: InputMaybe<ModelBooleanInput>;
  nativeDomainId?: InputMaybe<ModelIntInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelExpenditureConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelExpenditureConditionInput>>>;
  ownerAddress?: InputMaybe<ModelIdInput>;
  splitPaymentPayoutClaimedNotificationSent?: InputMaybe<ModelBooleanInput>;
  stagedExpenditureAddress?: InputMaybe<ModelIdInput>;
  stakedExpenditureAddress?: InputMaybe<ModelIdInput>;
  status?: InputMaybe<ModelExpenditureStatusInput>;
  type?: InputMaybe<ModelExpenditureTypeInput>;
  userStakeId?: InputMaybe<ModelIdInput>;
};

export type ModelExpenditureConnection = {
  __typename?: 'ModelExpenditureConnection';
  items: Array<Maybe<Expenditure>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelExpenditureFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelExpenditureFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  finalizedAt?: InputMaybe<ModelIntInput>;
  firstEditTransactionHash?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  isStaked?: InputMaybe<ModelBooleanInput>;
  nativeDomainId?: InputMaybe<ModelIntInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelExpenditureFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelExpenditureFilterInput>>>;
  ownerAddress?: InputMaybe<ModelIdInput>;
  splitPaymentPayoutClaimedNotificationSent?: InputMaybe<ModelBooleanInput>;
  stagedExpenditureAddress?: InputMaybe<ModelIdInput>;
  stakedExpenditureAddress?: InputMaybe<ModelIdInput>;
  status?: InputMaybe<ModelExpenditureStatusInput>;
  type?: InputMaybe<ModelExpenditureTypeInput>;
  userStakeId?: InputMaybe<ModelIdInput>;
};

export type ModelExpenditureMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelExpenditureMetadataConditionInput>>>;
  distributionType?: InputMaybe<ModelSplitPaymentDistributionTypeInput>;
  expectedNumberOfPayouts?: InputMaybe<ModelIntInput>;
  expectedNumberOfTokens?: InputMaybe<ModelIntInput>;
  fundFromDomainNativeId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelExpenditureMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelExpenditureMetadataConditionInput>>>;
};

export type ModelExpenditureMetadataConnection = {
  __typename?: 'ModelExpenditureMetadataConnection';
  items: Array<Maybe<ExpenditureMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelExpenditureMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelExpenditureMetadataFilterInput>>>;
  distributionType?: InputMaybe<ModelSplitPaymentDistributionTypeInput>;
  expectedNumberOfPayouts?: InputMaybe<ModelIntInput>;
  expectedNumberOfTokens?: InputMaybe<ModelIntInput>;
  fundFromDomainNativeId?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelExpenditureMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelExpenditureMetadataFilterInput>>>;
};

export type ModelExpenditureStatusInput = {
  eq?: InputMaybe<ExpenditureStatus>;
  ne?: InputMaybe<ExpenditureStatus>;
};

export type ModelExpenditureTypeInput = {
  eq?: InputMaybe<ExpenditureType>;
  ne?: InputMaybe<ExpenditureType>;
};

export type ModelExtensionInstallationsCountConditionInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelExtensionInstallationsCountConditionInput>>
  >;
  multiSigPermissions?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelExtensionInstallationsCountConditionInput>;
  oneTxPayment?: InputMaybe<ModelIntInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelExtensionInstallationsCountConditionInput>>
  >;
  reputationWeighted?: InputMaybe<ModelIntInput>;
  stagedExpenditure?: InputMaybe<ModelIntInput>;
  stakedExpenditure?: InputMaybe<ModelIntInput>;
  streamingPayments?: InputMaybe<ModelIntInput>;
};

export type ModelExtensionInstallationsCountConnection = {
  __typename?: 'ModelExtensionInstallationsCountConnection';
  items: Array<Maybe<ExtensionInstallationsCount>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelExtensionInstallationsCountFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelExtensionInstallationsCountFilterInput>>
  >;
  id?: InputMaybe<ModelIdInput>;
  multiSigPermissions?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelExtensionInstallationsCountFilterInput>;
  oneTxPayment?: InputMaybe<ModelIntInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelExtensionInstallationsCountFilterInput>>
  >;
  reputationWeighted?: InputMaybe<ModelIntInput>;
  stagedExpenditure?: InputMaybe<ModelIntInput>;
  stakedExpenditure?: InputMaybe<ModelIntInput>;
  streamingPayments?: InputMaybe<ModelIntInput>;
};

export type ModelFloatInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
};

export type ModelFloatKeyConditionInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
};

export type ModelIdInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  notContains?: InputMaybe<Scalars['ID']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type ModelIdKeyConditionInput = {
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
};

export type ModelIngestorStatsConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelIngestorStatsConditionInput>>>;
  not?: InputMaybe<ModelIngestorStatsConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelIngestorStatsConditionInput>>>;
  value?: InputMaybe<ModelStringInput>;
};

export type ModelIngestorStatsConnection = {
  __typename?: 'ModelIngestorStatsConnection';
  items: Array<Maybe<IngestorStats>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelIngestorStatsFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelIngestorStatsFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelIngestorStatsFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelIngestorStatsFilterInput>>>;
  value?: InputMaybe<ModelStringInput>;
};

export type ModelIntInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
};

export type ModelIntKeyConditionInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
};

export type ModelLiquidationAddressConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelLiquidationAddressConditionInput>>>;
  chainId?: InputMaybe<ModelIntInput>;
  liquidationAddress?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelLiquidationAddressConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelLiquidationAddressConditionInput>>>;
  userAddress?: InputMaybe<ModelIdInput>;
};

export type ModelLiquidationAddressConnection = {
  __typename?: 'ModelLiquidationAddressConnection';
  items: Array<Maybe<LiquidationAddress>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelLiquidationAddressFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelLiquidationAddressFilterInput>>>;
  chainId?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  liquidationAddress?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelLiquidationAddressFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelLiquidationAddressFilterInput>>>;
  userAddress?: InputMaybe<ModelIdInput>;
};

export type ModelMotionMessageConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelMotionMessageConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  messageKey?: InputMaybe<ModelStringInput>;
  motionId?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelMotionMessageConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelMotionMessageConditionInput>>>;
  vote?: InputMaybe<ModelStringInput>;
};

export type ModelMotionMessageConnection = {
  __typename?: 'ModelMotionMessageConnection';
  items: Array<Maybe<MotionMessage>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelMotionMessageFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelMotionMessageFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  messageKey?: InputMaybe<ModelStringInput>;
  motionId?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelMotionMessageFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelMotionMessageFilterInput>>>;
  vote?: InputMaybe<ModelStringInput>;
};

export type ModelMultiSigUserSignatureConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelMultiSigUserSignatureConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  multiSigId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelMultiSigUserSignatureConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelMultiSigUserSignatureConditionInput>>>;
  role?: InputMaybe<ModelIntInput>;
  userAddress?: InputMaybe<ModelIdInput>;
  vote?: InputMaybe<ModelMultiSigVoteInput>;
};

export type ModelMultiSigUserSignatureConnection = {
  __typename?: 'ModelMultiSigUserSignatureConnection';
  items: Array<Maybe<MultiSigUserSignature>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelMultiSigUserSignatureFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelMultiSigUserSignatureFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  multiSigId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelMultiSigUserSignatureFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelMultiSigUserSignatureFilterInput>>>;
  role?: InputMaybe<ModelIntInput>;
  userAddress?: InputMaybe<ModelIdInput>;
  vote?: InputMaybe<ModelMultiSigVoteInput>;
};

export type ModelMultiSigVoteInput = {
  eq?: InputMaybe<MultiSigVote>;
  ne?: InputMaybe<MultiSigVote>;
};

export type ModelNotificationsDataConditionInput = {
  adminNotificationsDisabled?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelNotificationsDataConditionInput>>>;
  magicbellUserId?: InputMaybe<ModelIdInput>;
  mentionNotificationsDisabled?: InputMaybe<ModelBooleanInput>;
  mutedColonyAddresses?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelNotificationsDataConditionInput>;
  notificationsDisabled?: InputMaybe<ModelBooleanInput>;
  or?: InputMaybe<Array<InputMaybe<ModelNotificationsDataConditionInput>>>;
  paymentNotificationsDisabled?: InputMaybe<ModelBooleanInput>;
};

export type ModelNotificationsDataConnection = {
  __typename?: 'ModelNotificationsDataConnection';
  items: Array<Maybe<NotificationsData>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelNotificationsDataFilterInput = {
  adminNotificationsDisabled?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelNotificationsDataFilterInput>>>;
  magicbellUserId?: InputMaybe<ModelIdInput>;
  mentionNotificationsDisabled?: InputMaybe<ModelBooleanInput>;
  mutedColonyAddresses?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelNotificationsDataFilterInput>;
  notificationsDisabled?: InputMaybe<ModelBooleanInput>;
  or?: InputMaybe<Array<InputMaybe<ModelNotificationsDataFilterInput>>>;
  paymentNotificationsDisabled?: InputMaybe<ModelBooleanInput>;
  userAddress?: InputMaybe<ModelIdInput>;
};

export type ModelPrivateBetaInviteCodeConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelPrivateBetaInviteCodeConditionInput>>>;
  not?: InputMaybe<ModelPrivateBetaInviteCodeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelPrivateBetaInviteCodeConditionInput>>>;
  shareableInvites?: InputMaybe<ModelIntInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelPrivateBetaInviteCodeConnection = {
  __typename?: 'ModelPrivateBetaInviteCodeConnection';
  items: Array<Maybe<PrivateBetaInviteCode>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelPrivateBetaInviteCodeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelPrivateBetaInviteCodeFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelPrivateBetaInviteCodeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelPrivateBetaInviteCodeFilterInput>>>;
  shareableInvites?: InputMaybe<ModelIntInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelProfileConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProfileConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  bio?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  displayNameChanged?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  hasCompletedKYCFlow?: InputMaybe<ModelBooleanInput>;
  isAutoOfframpEnabled?: InputMaybe<ModelBooleanInput>;
  location?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProfileConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProfileConditionInput>>>;
  preferredCurrency?: InputMaybe<ModelSupportedCurrenciesInput>;
  thumbnail?: InputMaybe<ModelStringInput>;
  website?: InputMaybe<ModelStringInput>;
};

export type ModelProfileConnection = {
  __typename?: 'ModelProfileConnection';
  items: Array<Maybe<Profile>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelProfileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProfileFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  bio?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  displayNameChanged?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  hasCompletedKYCFlow?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  isAutoOfframpEnabled?: InputMaybe<ModelBooleanInput>;
  location?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProfileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProfileFilterInput>>>;
  preferredCurrency?: InputMaybe<ModelSupportedCurrenciesInput>;
  thumbnail?: InputMaybe<ModelStringInput>;
  website?: InputMaybe<ModelStringInput>;
};

export type ModelProxyColonyConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProxyColonyConditionInput>>>;
  chainId?: InputMaybe<ModelStringInput>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  isActive?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelProxyColonyConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProxyColonyConditionInput>>>;
};

export type ModelProxyColonyConnection = {
  __typename?: 'ModelProxyColonyConnection';
  items: Array<Maybe<ProxyColony>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelProxyColonyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProxyColonyFilterInput>>>;
  chainId?: InputMaybe<ModelStringInput>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  isActive?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelProxyColonyFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProxyColonyFilterInput>>>;
};

export type ModelReputationMiningCycleMetadataConditionInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelReputationMiningCycleMetadataConditionInput>>
  >;
  lastCompletedAt?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelReputationMiningCycleMetadataConditionInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelReputationMiningCycleMetadataConditionInput>>
  >;
};

export type ModelReputationMiningCycleMetadataConnection = {
  __typename?: 'ModelReputationMiningCycleMetadataConnection';
  items: Array<Maybe<ReputationMiningCycleMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelReputationMiningCycleMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelReputationMiningCycleMetadataFilterInput>>
  >;
  id?: InputMaybe<ModelIdInput>;
  lastCompletedAt?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelReputationMiningCycleMetadataFilterInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelReputationMiningCycleMetadataFilterInput>>
  >;
};

export type ModelSafeTransactionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSafeTransactionConditionInput>>>;
  not?: InputMaybe<ModelSafeTransactionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSafeTransactionConditionInput>>>;
};

export type ModelSafeTransactionConnection = {
  __typename?: 'ModelSafeTransactionConnection';
  items: Array<Maybe<SafeTransaction>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelSafeTransactionDataConditionInput = {
  abi?: InputMaybe<ModelStringInput>;
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSafeTransactionDataConditionInput>>>;
  contractFunction?: InputMaybe<ModelStringInput>;
  data?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelSafeTransactionDataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSafeTransactionDataConditionInput>>>;
  rawAmount?: InputMaybe<ModelStringInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  transactionHash?: InputMaybe<ModelIdInput>;
  transactionType?: InputMaybe<ModelSafeTransactionTypeInput>;
};

export type ModelSafeTransactionDataConnection = {
  __typename?: 'ModelSafeTransactionDataConnection';
  items: Array<Maybe<SafeTransactionData>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelSafeTransactionDataFilterInput = {
  abi?: InputMaybe<ModelStringInput>;
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSafeTransactionDataFilterInput>>>;
  contractFunction?: InputMaybe<ModelStringInput>;
  data?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelSafeTransactionDataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSafeTransactionDataFilterInput>>>;
  rawAmount?: InputMaybe<ModelStringInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  transactionHash?: InputMaybe<ModelIdInput>;
  transactionType?: InputMaybe<ModelSafeTransactionTypeInput>;
};

export type ModelSafeTransactionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSafeTransactionFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelSafeTransactionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSafeTransactionFilterInput>>>;
};

export type ModelSafeTransactionTypeInput = {
  eq?: InputMaybe<SafeTransactionType>;
  ne?: InputMaybe<SafeTransactionType>;
};

export type ModelSizeInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
};

export enum ModelSortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type ModelSplitPaymentDistributionTypeInput = {
  eq?: InputMaybe<SplitPaymentDistributionType>;
  ne?: InputMaybe<SplitPaymentDistributionType>;
};

export type ModelStreamingPaymentConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelStreamingPaymentConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  endTime?: InputMaybe<ModelIntInput>;
  interval?: InputMaybe<ModelStringInput>;
  nativeDomainId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelStreamingPaymentConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelStreamingPaymentConditionInput>>>;
  recipientAddress?: InputMaybe<ModelStringInput>;
  startTime?: InputMaybe<ModelIntInput>;
};

export type ModelStreamingPaymentConnection = {
  __typename?: 'ModelStreamingPaymentConnection';
  items: Array<Maybe<StreamingPayment>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelStreamingPaymentEndConditionInput = {
  eq?: InputMaybe<StreamingPaymentEndCondition>;
  ne?: InputMaybe<StreamingPaymentEndCondition>;
};

export type ModelStreamingPaymentFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelStreamingPaymentFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  endTime?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  interval?: InputMaybe<ModelStringInput>;
  nativeDomainId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelStreamingPaymentFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelStreamingPaymentFilterInput>>>;
  recipientAddress?: InputMaybe<ModelStringInput>;
  startTime?: InputMaybe<ModelIntInput>;
};

export type ModelStreamingPaymentMetadataConditionInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelStreamingPaymentMetadataConditionInput>>
  >;
  endCondition?: InputMaybe<ModelStreamingPaymentEndConditionInput>;
  limitAmount?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelStreamingPaymentMetadataConditionInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelStreamingPaymentMetadataConditionInput>>
  >;
};

export type ModelStreamingPaymentMetadataConnection = {
  __typename?: 'ModelStreamingPaymentMetadataConnection';
  items: Array<Maybe<StreamingPaymentMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelStreamingPaymentMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelStreamingPaymentMetadataFilterInput>>>;
  endCondition?: InputMaybe<ModelStreamingPaymentEndConditionInput>;
  id?: InputMaybe<ModelIdInput>;
  limitAmount?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelStreamingPaymentMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelStreamingPaymentMetadataFilterInput>>>;
};

export type ModelStringInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  notContains?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type ModelStringKeyConditionInput = {
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
};

export type ModelSubscriptionAnnotationFilterInput = {
  actionId?: InputMaybe<ModelSubscriptionIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionAnnotationFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  ipfsHash?: InputMaybe<ModelSubscriptionStringInput>;
  message?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionAnnotationFilterInput>>>;
};

export type ModelSubscriptionBooleanInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export type ModelSubscriptionCacheTotalBalanceFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionCacheTotalBalanceFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  date?: InputMaybe<ModelSubscriptionStringInput>;
  domainId?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionCacheTotalBalanceFilterInput>>
  >;
  timeframePeriod?: InputMaybe<ModelSubscriptionIntInput>;
  timeframeType?: InputMaybe<ModelSubscriptionStringInput>;
  totalUSDC?: InputMaybe<ModelSubscriptionStringInput>;
  totalUSDCIn?: InputMaybe<ModelSubscriptionStringInput>;
  totalUSDCOut?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyActionFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  annotationId?: InputMaybe<ModelSubscriptionIdInput>;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyDecisionId?: InputMaybe<ModelSubscriptionIdInput>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  expenditureId?: InputMaybe<ModelSubscriptionIdInput>;
  expenditureSlotIds?: InputMaybe<ModelSubscriptionIntInput>;
  fromDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  fromPotId?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  individualEvents?: InputMaybe<ModelSubscriptionStringInput>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  isMotion?: InputMaybe<ModelSubscriptionBooleanInput>;
  isMotionFinalization?: InputMaybe<ModelSubscriptionBooleanInput>;
  isMultiSig?: InputMaybe<ModelSubscriptionBooleanInput>;
  members?: InputMaybe<ModelSubscriptionIdInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIntInput>;
  motionId?: InputMaybe<ModelSubscriptionIdInput>;
  multiSigId?: InputMaybe<ModelSubscriptionIdInput>;
  networkFee?: InputMaybe<ModelSubscriptionStringInput>;
  newColonyVersion?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  paymentId?: InputMaybe<ModelSubscriptionIntInput>;
  pendingColonyMetadataId?: InputMaybe<ModelSubscriptionIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelSubscriptionIdInput>;
  recipientAddress?: InputMaybe<ModelSubscriptionIdInput>;
  rolesAreMultiSig?: InputMaybe<ModelSubscriptionBooleanInput>;
  rootHash?: InputMaybe<ModelSubscriptionStringInput>;
  showInActionsList?: InputMaybe<ModelSubscriptionBooleanInput>;
  toDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  toPotId?: InputMaybe<ModelSubscriptionIntInput>;
  tokenAddress?: InputMaybe<ModelSubscriptionIdInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyActionMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyActionMetadataFilterInput>>
  >;
  customTitle?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyActionMetadataFilterInput>>
  >;
};

export type ModelSubscriptionColonyContributorFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyContributorFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  colonyReputationPercentage?: InputMaybe<ModelSubscriptionFloatInput>;
  contributorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  hasPermissions?: InputMaybe<ModelSubscriptionBooleanInput>;
  hasReputation?: InputMaybe<ModelSubscriptionBooleanInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isVerified?: InputMaybe<ModelSubscriptionBooleanInput>;
  isWatching?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyContributorFilterInput>>
  >;
  type?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyDecisionFilterInput = {
  actionId?: InputMaybe<ModelSubscriptionIdInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyDecisionFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyDecisionFilterInput>>
  >;
  showInDecisionsList?: InputMaybe<ModelSubscriptionBooleanInput>;
  title?: InputMaybe<ModelSubscriptionStringInput>;
  walletAddress?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyExtensionFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyExtensionFilterInput>>
  >;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  hash?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  installedAt?: InputMaybe<ModelSubscriptionIntInput>;
  installedBy?: InputMaybe<ModelSubscriptionStringInput>;
  isDeleted?: InputMaybe<ModelSubscriptionBooleanInput>;
  isDeprecated?: InputMaybe<ModelSubscriptionBooleanInput>;
  isInitialized?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyExtensionFilterInput>>
  >;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionColonyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFilterInput>>>;
  colonyMemberInviteCode?: InputMaybe<ModelSubscriptionIdInput>;
  createdAtBlock?: InputMaybe<ModelSubscriptionIntInput>;
  expendituresGlobalClaimDelay?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  lastUpdatedContributorsWithReputation?: InputMaybe<ModelSubscriptionStringInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  nativeTokenId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFilterInput>>>;
  private?: InputMaybe<ModelSubscriptionBooleanInput>;
  reputation?: InputMaybe<ModelSubscriptionStringInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionColonyFundsClaimFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>>
  >;
  colonyFundsClaimsId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  createdAtBlock?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isClaimed?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>>
  >;
};

export type ModelSubscriptionColonyHistoricRoleFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>>
  >;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  domainId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isMultiSig?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>>
  >;
  role_0?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_1?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_2?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_3?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_5?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_6?: InputMaybe<ModelSubscriptionBooleanInput>;
  targetAddress?: InputMaybe<ModelSubscriptionIdInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyMemberInviteFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMemberInviteFilterInput>>
  >;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  invitesRemaining?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMemberInviteFilterInput>>
  >;
};

export type ModelSubscriptionColonyMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMetadataFilterInput>>
  >;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  displayName?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMetadataFilterInput>>
  >;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyMotionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMotionFilterInput>>>;
  createdBy?: InputMaybe<ModelSubscriptionStringInput>;
  expenditureId?: InputMaybe<ModelSubscriptionIdInput>;
  expenditureSlotIds?: InputMaybe<ModelSubscriptionIntInput>;
  hasObjection?: InputMaybe<ModelSubscriptionBooleanInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isDecision?: InputMaybe<ModelSubscriptionBooleanInput>;
  isFinalized?: InputMaybe<ModelSubscriptionBooleanInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelSubscriptionStringInput>;
  nativeMotionId?: InputMaybe<ModelSubscriptionStringInput>;
  objectionAnnotationId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMotionFilterInput>>>;
  remainingStakes?: InputMaybe<ModelSubscriptionStringInput>;
  repSubmitted?: InputMaybe<ModelSubscriptionStringInput>;
  requiredStake?: InputMaybe<ModelSubscriptionStringInput>;
  skillRep?: InputMaybe<ModelSubscriptionStringInput>;
  transactionHash?: InputMaybe<ModelSubscriptionIdInput>;
  userMinStake?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyMultiSigFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMultiSigFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  executedAt?: InputMaybe<ModelSubscriptionStringInput>;
  executedBy?: InputMaybe<ModelSubscriptionIdInput>;
  expenditureId?: InputMaybe<ModelSubscriptionIdInput>;
  hasActionCompleted?: InputMaybe<ModelSubscriptionBooleanInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isDecision?: InputMaybe<ModelSubscriptionBooleanInput>;
  isExecuted?: InputMaybe<ModelSubscriptionBooleanInput>;
  isRejected?: InputMaybe<ModelSubscriptionBooleanInput>;
  multiSigDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  nativeMultiSigDomainId?: InputMaybe<ModelSubscriptionStringInput>;
  nativeMultiSigId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMultiSigFilterInput>>
  >;
  rejectedAt?: InputMaybe<ModelSubscriptionStringInput>;
  rejectedBy?: InputMaybe<ModelSubscriptionIdInput>;
  requiredPermissions?: InputMaybe<ModelSubscriptionIntInput>;
  transactionHash?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionColonyRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyRoleFilterInput>>>;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  domainId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isMultiSig?: InputMaybe<ModelSubscriptionBooleanInput>;
  latestBlock?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyRoleFilterInput>>>;
  role_0?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_1?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_2?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_3?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_5?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_6?: InputMaybe<ModelSubscriptionBooleanInput>;
  targetAddress?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionColonyTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyTokensFilterInput>>>;
  colonyID?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionContractEventFilterInput = {
  agent?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionContractEventFilterInput>>
  >;
  encodedArguments?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionContractEventFilterInput>>>;
  signature?: InputMaybe<ModelSubscriptionStringInput>;
  target?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionContributorReputationFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionContributorReputationFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  contributorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  domainId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionContributorReputationFilterInput>>
  >;
  reputationPercentage?: InputMaybe<ModelSubscriptionFloatInput>;
  reputationRaw?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionCurrentNetworkInverseFeeFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  inverseFee?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>>
  >;
};

export type ModelSubscriptionCurrentVersionFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionCurrentVersionFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  key?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionCurrentVersionFilterInput>>
  >;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionDomainFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isRoot?: InputMaybe<ModelSubscriptionBooleanInput>;
  nativeFundingPotId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeSkillId?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
  reputation?: InputMaybe<ModelSubscriptionStringInput>;
  reputationPercentage?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionDomainMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionDomainMetadataFilterInput>>
  >;
  color?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionDomainMetadataFilterInput>>
  >;
};

export type ModelSubscriptionExpenditureFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionExpenditureFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  finalizedAt?: InputMaybe<ModelSubscriptionIntInput>;
  firstEditTransactionHash?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isStaked?: InputMaybe<ModelSubscriptionBooleanInput>;
  nativeDomainId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeFundingPotId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeId?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionExpenditureFilterInput>>>;
  ownerAddress?: InputMaybe<ModelSubscriptionIdInput>;
  splitPaymentPayoutClaimedNotificationSent?: InputMaybe<ModelSubscriptionBooleanInput>;
  stagedExpenditureAddress?: InputMaybe<ModelSubscriptionIdInput>;
  stakedExpenditureAddress?: InputMaybe<ModelSubscriptionIdInput>;
  status?: InputMaybe<ModelSubscriptionStringInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
  userStakeId?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionExpenditureMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionExpenditureMetadataFilterInput>>
  >;
  distributionType?: InputMaybe<ModelSubscriptionStringInput>;
  expectedNumberOfPayouts?: InputMaybe<ModelSubscriptionIntInput>;
  expectedNumberOfTokens?: InputMaybe<ModelSubscriptionIntInput>;
  fundFromDomainNativeId?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionExpenditureMetadataFilterInput>>
  >;
};

export type ModelSubscriptionExtensionInstallationsCountFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionExtensionInstallationsCountFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  multiSigPermissions?: InputMaybe<ModelSubscriptionIntInput>;
  oneTxPayment?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionExtensionInstallationsCountFilterInput>>
  >;
  reputationWeighted?: InputMaybe<ModelSubscriptionIntInput>;
  stagedExpenditure?: InputMaybe<ModelSubscriptionIntInput>;
  stakedExpenditure?: InputMaybe<ModelSubscriptionIntInput>;
  streamingPayments?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionFloatInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

export type ModelSubscriptionIdInput = {
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  notContains?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type ModelSubscriptionIngestorStatsFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionIngestorStatsFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionIngestorStatsFilterInput>>>;
  value?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionIntInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type ModelSubscriptionLiquidationAddressFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionLiquidationAddressFilterInput>>
  >;
  chainId?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  liquidationAddress?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionLiquidationAddressFilterInput>>
  >;
  userAddress?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionMotionMessageFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionMotionMessageFilterInput>>
  >;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  messageKey?: InputMaybe<ModelSubscriptionStringInput>;
  motionId?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionMotionMessageFilterInput>>>;
  vote?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionMultiSigUserSignatureFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionMultiSigUserSignatureFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  multiSigId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionMultiSigUserSignatureFilterInput>>
  >;
  role?: InputMaybe<ModelSubscriptionIntInput>;
  userAddress?: InputMaybe<ModelSubscriptionIdInput>;
  vote?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionNotificationsDataFilterInput = {
  adminNotificationsDisabled?: InputMaybe<ModelSubscriptionBooleanInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionNotificationsDataFilterInput>>
  >;
  magicbellUserId?: InputMaybe<ModelSubscriptionIdInput>;
  mentionNotificationsDisabled?: InputMaybe<ModelSubscriptionBooleanInput>;
  mutedColonyAddresses?: InputMaybe<ModelSubscriptionIdInput>;
  notificationsDisabled?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionNotificationsDataFilterInput>>
  >;
  paymentNotificationsDisabled?: InputMaybe<ModelSubscriptionBooleanInput>;
  userAddress?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionPrivateBetaInviteCodeFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionPrivateBetaInviteCodeFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionPrivateBetaInviteCodeFilterInput>>
  >;
  shareableInvites?: InputMaybe<ModelSubscriptionIntInput>;
  userId?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionProfileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionProfileFilterInput>>>;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  bio?: InputMaybe<ModelSubscriptionStringInput>;
  displayName?: InputMaybe<ModelSubscriptionStringInput>;
  displayNameChanged?: InputMaybe<ModelSubscriptionStringInput>;
  email?: InputMaybe<ModelSubscriptionStringInput>;
  hasCompletedKYCFlow?: InputMaybe<ModelSubscriptionBooleanInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isAutoOfframpEnabled?: InputMaybe<ModelSubscriptionBooleanInput>;
  location?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionProfileFilterInput>>>;
  preferredCurrency?: InputMaybe<ModelSubscriptionStringInput>;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  website?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionProxyColonyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionProxyColonyFilterInput>>>;
  chainId?: InputMaybe<ModelSubscriptionStringInput>;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isActive?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionProxyColonyFilterInput>>>;
};

export type ModelSubscriptionReputationMiningCycleMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionReputationMiningCycleMetadataFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  lastCompletedAt?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionReputationMiningCycleMetadataFilterInput>>
  >;
};

export type ModelSubscriptionSafeTransactionDataFilterInput = {
  abi?: InputMaybe<ModelSubscriptionStringInput>;
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionSafeTransactionDataFilterInput>>
  >;
  contractFunction?: InputMaybe<ModelSubscriptionStringInput>;
  data?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionSafeTransactionDataFilterInput>>
  >;
  rawAmount?: InputMaybe<ModelSubscriptionStringInput>;
  tokenAddress?: InputMaybe<ModelSubscriptionIdInput>;
  transactionHash?: InputMaybe<ModelSubscriptionIdInput>;
  transactionType?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionSafeTransactionFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionSafeTransactionFilterInput>>
  >;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionSafeTransactionFilterInput>>
  >;
};

export type ModelSubscriptionStreamingPaymentFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionStreamingPaymentFilterInput>>
  >;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  endTime?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  interval?: InputMaybe<ModelSubscriptionStringInput>;
  nativeDomainId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeId?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionStreamingPaymentFilterInput>>
  >;
  recipientAddress?: InputMaybe<ModelSubscriptionStringInput>;
  startTime?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionStreamingPaymentMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionStreamingPaymentMetadataFilterInput>>
  >;
  endCondition?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  limitAmount?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionStreamingPaymentMetadataFilterInput>>
  >;
};

export type ModelSubscriptionStringInput = {
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  notContains?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ModelSubscriptionTokenExchangeRateFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionTokenExchangeRateFilterInput>>
  >;
  date?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionTokenExchangeRateFilterInput>>
  >;
  tokenId?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionTokenFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionTokenFilterInput>>>;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  decimals?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionTokenFilterInput>>>;
  symbol?: InputMaybe<ModelSubscriptionStringInput>;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
  validated?: InputMaybe<ModelSubscriptionBooleanInput>;
};

export type ModelSubscriptionTransactionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionTransactionFilterInput>>>;
  blockHash?: InputMaybe<ModelSubscriptionStringInput>;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  context?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  deleted?: InputMaybe<ModelSubscriptionBooleanInput>;
  deployedContractAddress?: InputMaybe<ModelSubscriptionStringInput>;
  eventData?: InputMaybe<ModelSubscriptionStringInput>;
  from?: InputMaybe<ModelSubscriptionIdInput>;
  gasLimit?: InputMaybe<ModelSubscriptionStringInput>;
  gasPrice?: InputMaybe<ModelSubscriptionStringInput>;
  groupId?: InputMaybe<ModelSubscriptionIdInput>;
  hash?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  identifier?: InputMaybe<ModelSubscriptionStringInput>;
  loadingRelated?: InputMaybe<ModelSubscriptionBooleanInput>;
  methodContext?: InputMaybe<ModelSubscriptionStringInput>;
  methodName?: InputMaybe<ModelSubscriptionStringInput>;
  options?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionTransactionFilterInput>>>;
  params?: InputMaybe<ModelSubscriptionStringInput>;
  receipt?: InputMaybe<ModelSubscriptionStringInput>;
  status?: InputMaybe<ModelSubscriptionStringInput>;
  title?: InputMaybe<ModelSubscriptionStringInput>;
  titleValues?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  bridgeCustomerId?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  profileId?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionUserStakeFilterInput = {
  actionId?: InputMaybe<ModelSubscriptionIdInput>;
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserStakeFilterInput>>>;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isClaimed?: InputMaybe<ModelSubscriptionBooleanInput>;
  isForfeited?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserStakeFilterInput>>>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
  userAddress?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionUserTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserTokensFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelSubscriptionIdInput>;
  userID?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionVoterRewardsHistoryFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionVoterRewardsHistoryFilterInput>>
  >;
  colonyAddress?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  motionId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionVoterRewardsHistoryFilterInput>>
  >;
  userAddress?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSupportedCurrenciesInput = {
  eq?: InputMaybe<SupportedCurrencies>;
  ne?: InputMaybe<SupportedCurrencies>;
};

export type ModelTimeframeTypeInput = {
  eq?: InputMaybe<TimeframeType>;
  ne?: InputMaybe<TimeframeType>;
};

export type ModelTokenConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  decimals?: InputMaybe<ModelIntInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenConditionInput>>>;
  symbol?: InputMaybe<ModelStringInput>;
  thumbnail?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelTokenTypeInput>;
  validated?: InputMaybe<ModelBooleanInput>;
};

export type ModelTokenConnection = {
  __typename?: 'ModelTokenConnection';
  items: Array<Maybe<Token>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelTokenExchangeRateConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenExchangeRateConditionInput>>>;
  date?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenExchangeRateConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenExchangeRateConditionInput>>>;
  tokenId?: InputMaybe<ModelStringInput>;
};

export type ModelTokenExchangeRateConnection = {
  __typename?: 'ModelTokenExchangeRateConnection';
  items: Array<Maybe<TokenExchangeRate>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelTokenExchangeRateFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenExchangeRateFilterInput>>>;
  date?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenExchangeRateFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenExchangeRateFilterInput>>>;
  tokenId?: InputMaybe<ModelStringInput>;
};

export type ModelTokenFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  decimals?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenFilterInput>>>;
  symbol?: InputMaybe<ModelStringInput>;
  thumbnail?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelTokenTypeInput>;
  validated?: InputMaybe<ModelBooleanInput>;
};

export type ModelTokenTypeInput = {
  eq?: InputMaybe<TokenType>;
  ne?: InputMaybe<TokenType>;
};

export type ModelTransactionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTransactionConditionInput>>>;
  blockHash?: InputMaybe<ModelStringInput>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  context?: InputMaybe<ModelClientTypeInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  deleted?: InputMaybe<ModelBooleanInput>;
  deployedContractAddress?: InputMaybe<ModelStringInput>;
  eventData?: InputMaybe<ModelStringInput>;
  from?: InputMaybe<ModelIdInput>;
  gasLimit?: InputMaybe<ModelStringInput>;
  gasPrice?: InputMaybe<ModelStringInput>;
  groupId?: InputMaybe<ModelIdInput>;
  hash?: InputMaybe<ModelStringInput>;
  identifier?: InputMaybe<ModelStringInput>;
  loadingRelated?: InputMaybe<ModelBooleanInput>;
  methodContext?: InputMaybe<ModelStringInput>;
  methodName?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTransactionConditionInput>;
  options?: InputMaybe<ModelStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTransactionConditionInput>>>;
  params?: InputMaybe<ModelStringInput>;
  receipt?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelTransactionStatusInput>;
  title?: InputMaybe<ModelStringInput>;
  titleValues?: InputMaybe<ModelStringInput>;
};

export type ModelTransactionConnection = {
  __typename?: 'ModelTransactionConnection';
  items: Array<Maybe<Transaction>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelTransactionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTransactionFilterInput>>>;
  blockHash?: InputMaybe<ModelStringInput>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  context?: InputMaybe<ModelClientTypeInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  deleted?: InputMaybe<ModelBooleanInput>;
  deployedContractAddress?: InputMaybe<ModelStringInput>;
  eventData?: InputMaybe<ModelStringInput>;
  from?: InputMaybe<ModelIdInput>;
  gasLimit?: InputMaybe<ModelStringInput>;
  gasPrice?: InputMaybe<ModelStringInput>;
  groupId?: InputMaybe<ModelIdInput>;
  hash?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  identifier?: InputMaybe<ModelStringInput>;
  loadingRelated?: InputMaybe<ModelBooleanInput>;
  methodContext?: InputMaybe<ModelStringInput>;
  methodName?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTransactionFilterInput>;
  options?: InputMaybe<ModelStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTransactionFilterInput>>>;
  params?: InputMaybe<ModelStringInput>;
  receipt?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelTransactionStatusInput>;
  title?: InputMaybe<ModelStringInput>;
  titleValues?: InputMaybe<ModelStringInput>;
};

export type ModelTransactionStatusInput = {
  eq?: InputMaybe<TransactionStatus>;
  ne?: InputMaybe<TransactionStatus>;
};

export type ModelUserConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  bridgeCustomerId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  profileId?: InputMaybe<ModelIdInput>;
  userPrivateBetaInviteCodeId?: InputMaybe<ModelIdInput>;
};

export type ModelUserConnection = {
  __typename?: 'ModelUserConnection';
  items: Array<Maybe<User>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  bridgeCustomerId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  profileId?: InputMaybe<ModelIdInput>;
  userPrivateBetaInviteCodeId?: InputMaybe<ModelIdInput>;
};

export type ModelUserStakeConditionInput = {
  actionId?: InputMaybe<ModelIdInput>;
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUserStakeConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  isClaimed?: InputMaybe<ModelBooleanInput>;
  isForfeited?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelUserStakeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserStakeConditionInput>>>;
  type?: InputMaybe<ModelUserStakeTypeInput>;
  userAddress?: InputMaybe<ModelIdInput>;
};

export type ModelUserStakeConnection = {
  __typename?: 'ModelUserStakeConnection';
  items: Array<Maybe<UserStake>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelUserStakeFilterInput = {
  actionId?: InputMaybe<ModelIdInput>;
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUserStakeFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  isClaimed?: InputMaybe<ModelBooleanInput>;
  isForfeited?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelUserStakeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserStakeFilterInput>>>;
  type?: InputMaybe<ModelUserStakeTypeInput>;
  userAddress?: InputMaybe<ModelIdInput>;
};

export type ModelUserStakeTypeInput = {
  eq?: InputMaybe<UserStakeType>;
  ne?: InputMaybe<UserStakeType>;
};

export type ModelUserTokensConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserTokensConditionInput>>>;
  not?: InputMaybe<ModelUserTokensConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserTokensConditionInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
  userID?: InputMaybe<ModelIdInput>;
};

export type ModelUserTokensConnection = {
  __typename?: 'ModelUserTokensConnection';
  items: Array<Maybe<UserTokens>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelUserTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserTokensFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserTokensFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
  userID?: InputMaybe<ModelIdInput>;
};

export type ModelVoterRewardsHistoryConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelVoterRewardsHistoryConditionInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  motionId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelVoterRewardsHistoryConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelVoterRewardsHistoryConditionInput>>>;
  userAddress?: InputMaybe<ModelIdInput>;
};

export type ModelVoterRewardsHistoryConnection = {
  __typename?: 'ModelVoterRewardsHistoryConnection';
  items: Array<Maybe<VoterRewardsHistory>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelVoterRewardsHistoryFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelVoterRewardsHistoryFilterInput>>>;
  colonyAddress?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  motionId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelVoterRewardsHistoryFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelVoterRewardsHistoryFilterInput>>>;
  userAddress?: InputMaybe<ModelIdInput>;
};

/** A status update message for a motion (will appear in the motion's timeline) */
export type MotionMessage = {
  __typename?: 'MotionMessage';
  /** Token amount relevant to the status update (if applicable) */
  amount?: Maybe<Scalars['String']>;
  /** Timestamp of when the status update was created in the database */
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  /**
   * Wallet address of the initiator of the status update
   * The zero address is used for messages that don't have an initiator (system messages)
   */
  initiatorAddress: Scalars['ID'];
  /** Extended user object for given initiatorAddress */
  initiatorUser?: Maybe<User>;
  /** Unique id for the message */
  messageKey: Scalars['String'];
  /** The internal database id of the motion */
  motionId: Scalars['ID'];
  /** Internal name of the status update event (e.g. `MotionCreated`, `MotionStaked`, etc.) */
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  /** Cast vote attached to the status update (if applicable) */
  vote?: Maybe<Scalars['String']>;
};

/** Input used to create a motion status update message */
export type MotionMessageInput = {
  /** Token amount relevant to the status update (if applicable) */
  amount?: InputMaybe<Scalars['String']>;
  /**
   * Wallet address of the initiator of the status update
   * The zero address is used for messages that don't have an initiator (system messages)
   */
  initiatorAddress: Scalars['String'];
  /** Unique id for the message */
  messageKey: Scalars['String'];
  /** Internal name of the status update event (e.g. `MotionCreated`, `MotionStaked`, etc.) */
  name: Scalars['String'];
  /** Cast vote attached to the status update (if applicable) */
  vote?: InputMaybe<Scalars['String']>;
};

/** Staked sides of a motion */
export type MotionStakeValues = {
  __typename?: 'MotionStakeValues';
  /** Number of votes against this motion */
  nay: Scalars['String'];
  /** Number of votes for this motion */
  yay: Scalars['String'];
};

/** Input type for modifying the staked side of a motion */
export type MotionStakeValuesInput = {
  /** Number of votes against this motion */
  nay: Scalars['String'];
  /** Number of votes for this motion */
  yay: Scalars['String'];
};

/** Staked sides of a motion */
export type MotionStakes = {
  __typename?: 'MotionStakes';
  /** Values in percentage of the total stakes */
  percentage: MotionStakeValues;
  /** Absolute values denominated in the native token */
  raw: MotionStakeValues;
};

/** Input used to modify the staked sides of a motion */
export type MotionStakesInput = {
  /** Values in percentage of the total stakes */
  percentage: MotionStakeValuesInput;
  /** Absolute values denominated in the native token */
  raw: MotionStakeValuesInput;
};

/** Quick access flages to check the current state of a motion in its lifecycle */
export type MotionStateHistory = {
  __typename?: 'MotionStateHistory';
  /** The timestamp when all votes were revealed */
  allVotesRevealedAt?: Maybe<Scalars['AWSDateTime']>;
  /** The timestamp when all votes were submitted */
  allVotesSubmittedAt?: Maybe<Scalars['AWSDateTime']>;
  /** The timestamp when the motion ended (Passed or failed) */
  endedAt?: Maybe<Scalars['AWSDateTime']>;
  /** The timestamp when the motion was finalized */
  finalizedAt?: Maybe<Scalars['AWSDateTime']>;
  /** Whether the motion has failed */
  hasFailed: Scalars['Boolean'];
  /** Whether the motion has failed and cannot be finalized (e.g. if it doesn't get staked) */
  hasFailedNotFinalizable: Scalars['Boolean'];
  /** Whether the motion has passed */
  hasPassed: Scalars['Boolean'];
  /** Voting period is elapsed */
  hasVoted: Scalars['Boolean'];
  /** Motion is in reveal phase (votes are being revealed) */
  inRevealPhase: Scalars['Boolean'];
  /** The timestamp when the NAY side was fully staked */
  naySideFullyStakedAt?: Maybe<Scalars['AWSDateTime']>;
  /** The timestamp when the YAY side was fully staked */
  yaySideFullyStakedAt?: Maybe<Scalars['AWSDateTime']>;
};

/** Input used to change the current state of a motion */
export type MotionStateHistoryInput = {
  /** The timestamp when all votes were revealed */
  allVotesRevealedAt?: InputMaybe<Scalars['AWSDateTime']>;
  /** The timestamp when all votes were submitted */
  allVotesSubmittedAt?: InputMaybe<Scalars['AWSDateTime']>;
  /** The timestamp when the motion ended (Passed or failed) */
  endedAt?: InputMaybe<Scalars['AWSDateTime']>;
  /** The timestamp when the motion was finalized */
  finalizedAt?: InputMaybe<Scalars['AWSDateTime']>;
  /** Whether the motion has failed */
  hasFailed: Scalars['Boolean'];
  /** Whether the motion has failed and cannot be finalized (e.g. if it doesn't get staked) */
  hasFailedNotFinalizable: Scalars['Boolean'];
  /** Whether the motion has passed */
  hasPassed: Scalars['Boolean'];
  /** Voting period is elapsed */
  hasVoted: Scalars['Boolean'];
  /** Motion is in reveal phase (votes are being revealed) */
  inRevealPhase: Scalars['Boolean'];
  /** The timestamp when the NAY side was fully staked */
  naySideFullyStakedAt?: InputMaybe<Scalars['AWSDateTime']>;
  /** The timestamp when the YAY side was fully staked */
  yaySideFullyStakedAt?: InputMaybe<Scalars['AWSDateTime']>;
};

export type MultiSigDomainConfig = {
  __typename?: 'MultiSigDomainConfig';
  domainId: Scalars['ID'];
  domainThreshold: Scalars['Int'];
};

export type MultiSigDomainConfigInput = {
  domainId: Scalars['ID'];
  domainThreshold: Scalars['Int'];
};

export type MultiSigParams = {
  __typename?: 'MultiSigParams';
  colonyThreshold: Scalars['Int'];
  domainThresholds?: Maybe<Array<Maybe<MultiSigDomainConfig>>>;
};

export type MultiSigParamsInput = {
  colonyThreshold: Scalars['Int'];
  domainThresholds?: InputMaybe<Array<InputMaybe<MultiSigDomainConfigInput>>>;
};

export type MultiSigUserSignature = {
  __typename?: 'MultiSigUserSignature';
  colonyAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  multiSigId: Scalars['ID'];
  role: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userAddress: Scalars['ID'];
  vote: MultiSigVote;
};

export enum MultiSigVote {
  Approve = 'Approve',
  None = 'None',
  Reject = 'Reject',
}

/** Root mutation type */
export type Mutation = {
  __typename?: 'Mutation';
  /** Create a Bridge XYZ Bank Account */
  bridgeCreateBankAccount?: Maybe<BridgeCreateBankAccountReturn>;
  /** Update a Bridge XYZ Bank Account */
  bridgeUpdateBankAccount?: Maybe<BridgeUpdateBankAccountReturn>;
  /** Post to the Bridge XYZ API */
  bridgeXYZMutation?: Maybe<BridgeXyzMutationReturn>;
  createAnnotation?: Maybe<Annotation>;
  createCacheTotalBalance?: Maybe<CacheTotalBalance>;
  createColony?: Maybe<Colony>;
  createColonyAction?: Maybe<ColonyAction>;
  createColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  createColonyContributor?: Maybe<ColonyContributor>;
  createColonyDecision?: Maybe<ColonyDecision>;
  /** Create temporary metadata entry for an upcoming colony (that will be created by the ingestor) */
  createColonyEtherealMetadata?: Maybe<ColonyMetadata>;
  createColonyExtension?: Maybe<ColonyExtension>;
  createColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  createColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  createColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  createColonyMetadata?: Maybe<ColonyMetadata>;
  createColonyMotion?: Maybe<ColonyMotion>;
  createColonyMultiSig?: Maybe<ColonyMultiSig>;
  createColonyRole?: Maybe<ColonyRole>;
  createColonyTokens?: Maybe<ColonyTokens>;
  createContractEvent?: Maybe<ContractEvent>;
  createContributorReputation?: Maybe<ContributorReputation>;
  createCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  createCurrentVersion?: Maybe<CurrentVersion>;
  createDomain?: Maybe<Domain>;
  createDomainMetadata?: Maybe<DomainMetadata>;
  createExpenditure?: Maybe<Expenditure>;
  createExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  createExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  createIngestorStats?: Maybe<IngestorStats>;
  createLiquidationAddress?: Maybe<LiquidationAddress>;
  createMotionMessage?: Maybe<MotionMessage>;
  createMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  createNotificationsData?: Maybe<NotificationsData>;
  createPrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  createProfile?: Maybe<Profile>;
  createProxyColony?: Maybe<ProxyColony>;
  createReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  createSafeTransaction?: Maybe<SafeTransaction>;
  createSafeTransactionData?: Maybe<SafeTransactionData>;
  createStreamingPayment?: Maybe<StreamingPayment>;
  createStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  createToken?: Maybe<Token>;
  createTokenExchangeRate?: Maybe<TokenExchangeRate>;
  createTransaction?: Maybe<Transaction>;
  /** Create a unique user within the Colony Network. Use this instead of the automatically generated `createUser` mutation */
  createUniqueUser?: Maybe<User>;
  createUser?: Maybe<User>;
  /** Create notification data for a user */
  createUserNotificationsData?: Maybe<NotificationsData>;
  createUserStake?: Maybe<UserStake>;
  createUserTokens?: Maybe<UserTokens>;
  createVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
  deleteAnnotation?: Maybe<Annotation>;
  deleteCacheTotalBalance?: Maybe<CacheTotalBalance>;
  deleteColony?: Maybe<Colony>;
  deleteColonyAction?: Maybe<ColonyAction>;
  deleteColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  deleteColonyContributor?: Maybe<ColonyContributor>;
  deleteColonyDecision?: Maybe<ColonyDecision>;
  deleteColonyExtension?: Maybe<ColonyExtension>;
  deleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  deleteColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  deleteColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  deleteColonyMetadata?: Maybe<ColonyMetadata>;
  deleteColonyMotion?: Maybe<ColonyMotion>;
  deleteColonyMultiSig?: Maybe<ColonyMultiSig>;
  deleteColonyRole?: Maybe<ColonyRole>;
  deleteColonyTokens?: Maybe<ColonyTokens>;
  deleteContractEvent?: Maybe<ContractEvent>;
  deleteContributorReputation?: Maybe<ContributorReputation>;
  deleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  deleteCurrentVersion?: Maybe<CurrentVersion>;
  deleteDomain?: Maybe<Domain>;
  deleteDomainMetadata?: Maybe<DomainMetadata>;
  deleteExpenditure?: Maybe<Expenditure>;
  deleteExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  deleteExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  deleteIngestorStats?: Maybe<IngestorStats>;
  deleteLiquidationAddress?: Maybe<LiquidationAddress>;
  deleteMotionMessage?: Maybe<MotionMessage>;
  deleteMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  deleteNotificationsData?: Maybe<NotificationsData>;
  deletePrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  deleteProfile?: Maybe<Profile>;
  deleteProxyColony?: Maybe<ProxyColony>;
  deleteReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  deleteSafeTransaction?: Maybe<SafeTransaction>;
  deleteSafeTransactionData?: Maybe<SafeTransactionData>;
  deleteStreamingPayment?: Maybe<StreamingPayment>;
  deleteStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  deleteToken?: Maybe<Token>;
  deleteTokenExchangeRate?: Maybe<TokenExchangeRate>;
  deleteTransaction?: Maybe<Transaction>;
  deleteUser?: Maybe<User>;
  deleteUserStake?: Maybe<UserStake>;
  deleteUserTokens?: Maybe<UserTokens>;
  deleteVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
  /** Initialize user (for now only cancels pending transactions) */
  initializeUser: InitializeUserReturn;
  updateAnnotation?: Maybe<Annotation>;
  updateCacheTotalBalance?: Maybe<CacheTotalBalance>;
  updateColony?: Maybe<Colony>;
  updateColonyAction?: Maybe<ColonyAction>;
  updateColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  updateColonyContributor?: Maybe<ColonyContributor>;
  updateColonyDecision?: Maybe<ColonyDecision>;
  updateColonyExtension?: Maybe<ColonyExtension>;
  updateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  updateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  updateColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  updateColonyMetadata?: Maybe<ColonyMetadata>;
  updateColonyMotion?: Maybe<ColonyMotion>;
  updateColonyMultiSig?: Maybe<ColonyMultiSig>;
  updateColonyRole?: Maybe<ColonyRole>;
  updateColonyTokens?: Maybe<ColonyTokens>;
  updateContractEvent?: Maybe<ContractEvent>;
  updateContributorReputation?: Maybe<ContributorReputation>;
  /** Update contributors with reputation in the database for a colony */
  updateContributorsWithReputation?: Maybe<Scalars['Boolean']>;
  updateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  updateCurrentVersion?: Maybe<CurrentVersion>;
  updateDomain?: Maybe<Domain>;
  updateDomainMetadata?: Maybe<DomainMetadata>;
  updateExpenditure?: Maybe<Expenditure>;
  updateExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  updateExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  updateIngestorStats?: Maybe<IngestorStats>;
  updateLiquidationAddress?: Maybe<LiquidationAddress>;
  updateMotionMessage?: Maybe<MotionMessage>;
  updateMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  updateNotificationsData?: Maybe<NotificationsData>;
  updatePrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  updateProfile?: Maybe<Profile>;
  updateProxyColony?: Maybe<ProxyColony>;
  updateReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  updateSafeTransaction?: Maybe<SafeTransaction>;
  updateSafeTransactionData?: Maybe<SafeTransactionData>;
  updateStreamingPayment?: Maybe<StreamingPayment>;
  updateStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  updateToken?: Maybe<Token>;
  updateTokenExchangeRate?: Maybe<TokenExchangeRate>;
  updateTransaction?: Maybe<Transaction>;
  updateUser?: Maybe<User>;
  updateUserStake?: Maybe<UserStake>;
  updateUserTokens?: Maybe<UserTokens>;
  updateVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
  /** Validates the user invite code and adds the user as a colony contributor */
  validateUserInvite?: Maybe<Scalars['Boolean']>;
};

/** Root mutation type */
export type MutationBridgeCreateBankAccountArgs = {
  input: BridgeCreateBankAccountInput;
};

/** Root mutation type */
export type MutationBridgeUpdateBankAccountArgs = {
  input: BridgeUpdateBankAccountInput;
};

/** Root mutation type */
export type MutationBridgeXyzMutationArgs = {
  input: BridgeXyzMutationInput;
};

/** Root mutation type */
export type MutationCreateAnnotationArgs = {
  condition?: InputMaybe<ModelAnnotationConditionInput>;
  input: CreateAnnotationInput;
};

/** Root mutation type */
export type MutationCreateCacheTotalBalanceArgs = {
  condition?: InputMaybe<ModelCacheTotalBalanceConditionInput>;
  input: CreateCacheTotalBalanceInput;
};

/** Root mutation type */
export type MutationCreateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: CreateColonyInput;
};

/** Root mutation type */
export type MutationCreateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: CreateColonyActionInput;
};

/** Root mutation type */
export type MutationCreateColonyActionMetadataArgs = {
  condition?: InputMaybe<ModelColonyActionMetadataConditionInput>;
  input: CreateColonyActionMetadataInput;
};

/** Root mutation type */
export type MutationCreateColonyContributorArgs = {
  condition?: InputMaybe<ModelColonyContributorConditionInput>;
  input: CreateColonyContributorInput;
};

/** Root mutation type */
export type MutationCreateColonyDecisionArgs = {
  condition?: InputMaybe<ModelColonyDecisionConditionInput>;
  input: CreateColonyDecisionInput;
};

/** Root mutation type */
export type MutationCreateColonyEtherealMetadataArgs = {
  input: CreateColonyEtherealMetadataInput;
};

/** Root mutation type */
export type MutationCreateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: CreateColonyExtensionInput;
};

/** Root mutation type */
export type MutationCreateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: CreateColonyFundsClaimInput;
};

/** Root mutation type */
export type MutationCreateColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: CreateColonyHistoricRoleInput;
};

/** Root mutation type */
export type MutationCreateColonyMemberInviteArgs = {
  condition?: InputMaybe<ModelColonyMemberInviteConditionInput>;
  input: CreateColonyMemberInviteInput;
};

/** Root mutation type */
export type MutationCreateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: CreateColonyMetadataInput;
};

/** Root mutation type */
export type MutationCreateColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: CreateColonyMotionInput;
};

/** Root mutation type */
export type MutationCreateColonyMultiSigArgs = {
  condition?: InputMaybe<ModelColonyMultiSigConditionInput>;
  input: CreateColonyMultiSigInput;
};

/** Root mutation type */
export type MutationCreateColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: CreateColonyRoleInput;
};

/** Root mutation type */
export type MutationCreateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: CreateColonyTokensInput;
};

/** Root mutation type */
export type MutationCreateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: CreateContractEventInput;
};

/** Root mutation type */
export type MutationCreateContributorReputationArgs = {
  condition?: InputMaybe<ModelContributorReputationConditionInput>;
  input: CreateContributorReputationInput;
};

/** Root mutation type */
export type MutationCreateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: CreateCurrentNetworkInverseFeeInput;
};

/** Root mutation type */
export type MutationCreateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: CreateCurrentVersionInput;
};

/** Root mutation type */
export type MutationCreateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: CreateDomainInput;
};

/** Root mutation type */
export type MutationCreateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: CreateDomainMetadataInput;
};

/** Root mutation type */
export type MutationCreateExpenditureArgs = {
  condition?: InputMaybe<ModelExpenditureConditionInput>;
  input: CreateExpenditureInput;
};

/** Root mutation type */
export type MutationCreateExpenditureMetadataArgs = {
  condition?: InputMaybe<ModelExpenditureMetadataConditionInput>;
  input: CreateExpenditureMetadataInput;
};

/** Root mutation type */
export type MutationCreateExtensionInstallationsCountArgs = {
  condition?: InputMaybe<ModelExtensionInstallationsCountConditionInput>;
  input: CreateExtensionInstallationsCountInput;
};

/** Root mutation type */
export type MutationCreateIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: CreateIngestorStatsInput;
};

/** Root mutation type */
export type MutationCreateLiquidationAddressArgs = {
  condition?: InputMaybe<ModelLiquidationAddressConditionInput>;
  input: CreateLiquidationAddressInput;
};

/** Root mutation type */
export type MutationCreateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: CreateMotionMessageInput;
};

/** Root mutation type */
export type MutationCreateMultiSigUserSignatureArgs = {
  condition?: InputMaybe<ModelMultiSigUserSignatureConditionInput>;
  input: CreateMultiSigUserSignatureInput;
};

/** Root mutation type */
export type MutationCreateNotificationsDataArgs = {
  condition?: InputMaybe<ModelNotificationsDataConditionInput>;
  input: CreateNotificationsDataInput;
};

/** Root mutation type */
export type MutationCreatePrivateBetaInviteCodeArgs = {
  condition?: InputMaybe<ModelPrivateBetaInviteCodeConditionInput>;
  input: CreatePrivateBetaInviteCodeInput;
};

/** Root mutation type */
export type MutationCreateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: CreateProfileInput;
};

/** Root mutation type */
export type MutationCreateProxyColonyArgs = {
  condition?: InputMaybe<ModelProxyColonyConditionInput>;
  input: CreateProxyColonyInput;
};

/** Root mutation type */
export type MutationCreateReputationMiningCycleMetadataArgs = {
  condition?: InputMaybe<ModelReputationMiningCycleMetadataConditionInput>;
  input: CreateReputationMiningCycleMetadataInput;
};

/** Root mutation type */
export type MutationCreateSafeTransactionArgs = {
  condition?: InputMaybe<ModelSafeTransactionConditionInput>;
  input: CreateSafeTransactionInput;
};

/** Root mutation type */
export type MutationCreateSafeTransactionDataArgs = {
  condition?: InputMaybe<ModelSafeTransactionDataConditionInput>;
  input: CreateSafeTransactionDataInput;
};

/** Root mutation type */
export type MutationCreateStreamingPaymentArgs = {
  condition?: InputMaybe<ModelStreamingPaymentConditionInput>;
  input: CreateStreamingPaymentInput;
};

/** Root mutation type */
export type MutationCreateStreamingPaymentMetadataArgs = {
  condition?: InputMaybe<ModelStreamingPaymentMetadataConditionInput>;
  input: CreateStreamingPaymentMetadataInput;
};

/** Root mutation type */
export type MutationCreateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: CreateTokenInput;
};

/** Root mutation type */
export type MutationCreateTokenExchangeRateArgs = {
  condition?: InputMaybe<ModelTokenExchangeRateConditionInput>;
  input: CreateTokenExchangeRateInput;
};

/** Root mutation type */
export type MutationCreateTransactionArgs = {
  condition?: InputMaybe<ModelTransactionConditionInput>;
  input: CreateTransactionInput;
};

/** Root mutation type */
export type MutationCreateUniqueUserArgs = {
  input?: InputMaybe<CreateUniqueUserInput>;
};

/** Root mutation type */
export type MutationCreateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: CreateUserInput;
};

/** Root mutation type */
export type MutationCreateUserNotificationsDataArgs = {
  input: CreateUserNotificationsDataInput;
};

/** Root mutation type */
export type MutationCreateUserStakeArgs = {
  condition?: InputMaybe<ModelUserStakeConditionInput>;
  input: CreateUserStakeInput;
};

/** Root mutation type */
export type MutationCreateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: CreateUserTokensInput;
};

/** Root mutation type */
export type MutationCreateVoterRewardsHistoryArgs = {
  condition?: InputMaybe<ModelVoterRewardsHistoryConditionInput>;
  input: CreateVoterRewardsHistoryInput;
};

/** Root mutation type */
export type MutationDeleteAnnotationArgs = {
  condition?: InputMaybe<ModelAnnotationConditionInput>;
  input: DeleteAnnotationInput;
};

/** Root mutation type */
export type MutationDeleteCacheTotalBalanceArgs = {
  condition?: InputMaybe<ModelCacheTotalBalanceConditionInput>;
  input: DeleteCacheTotalBalanceInput;
};

/** Root mutation type */
export type MutationDeleteColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: DeleteColonyInput;
};

/** Root mutation type */
export type MutationDeleteColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: DeleteColonyActionInput;
};

/** Root mutation type */
export type MutationDeleteColonyActionMetadataArgs = {
  condition?: InputMaybe<ModelColonyActionMetadataConditionInput>;
  input: DeleteColonyActionMetadataInput;
};

/** Root mutation type */
export type MutationDeleteColonyContributorArgs = {
  condition?: InputMaybe<ModelColonyContributorConditionInput>;
  input: DeleteColonyContributorInput;
};

/** Root mutation type */
export type MutationDeleteColonyDecisionArgs = {
  condition?: InputMaybe<ModelColonyDecisionConditionInput>;
  input: DeleteColonyDecisionInput;
};

/** Root mutation type */
export type MutationDeleteColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: DeleteColonyExtensionInput;
};

/** Root mutation type */
export type MutationDeleteColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: DeleteColonyFundsClaimInput;
};

/** Root mutation type */
export type MutationDeleteColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: DeleteColonyHistoricRoleInput;
};

/** Root mutation type */
export type MutationDeleteColonyMemberInviteArgs = {
  condition?: InputMaybe<ModelColonyMemberInviteConditionInput>;
  input: DeleteColonyMemberInviteInput;
};

/** Root mutation type */
export type MutationDeleteColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: DeleteColonyMetadataInput;
};

/** Root mutation type */
export type MutationDeleteColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: DeleteColonyMotionInput;
};

/** Root mutation type */
export type MutationDeleteColonyMultiSigArgs = {
  condition?: InputMaybe<ModelColonyMultiSigConditionInput>;
  input: DeleteColonyMultiSigInput;
};

/** Root mutation type */
export type MutationDeleteColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: DeleteColonyRoleInput;
};

/** Root mutation type */
export type MutationDeleteColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: DeleteColonyTokensInput;
};

/** Root mutation type */
export type MutationDeleteContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: DeleteContractEventInput;
};

/** Root mutation type */
export type MutationDeleteContributorReputationArgs = {
  condition?: InputMaybe<ModelContributorReputationConditionInput>;
  input: DeleteContributorReputationInput;
};

/** Root mutation type */
export type MutationDeleteCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: DeleteCurrentNetworkInverseFeeInput;
};

/** Root mutation type */
export type MutationDeleteCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: DeleteCurrentVersionInput;
};

/** Root mutation type */
export type MutationDeleteDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: DeleteDomainInput;
};

/** Root mutation type */
export type MutationDeleteDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: DeleteDomainMetadataInput;
};

/** Root mutation type */
export type MutationDeleteExpenditureArgs = {
  condition?: InputMaybe<ModelExpenditureConditionInput>;
  input: DeleteExpenditureInput;
};

/** Root mutation type */
export type MutationDeleteExpenditureMetadataArgs = {
  condition?: InputMaybe<ModelExpenditureMetadataConditionInput>;
  input: DeleteExpenditureMetadataInput;
};

/** Root mutation type */
export type MutationDeleteExtensionInstallationsCountArgs = {
  condition?: InputMaybe<ModelExtensionInstallationsCountConditionInput>;
  input: DeleteExtensionInstallationsCountInput;
};

/** Root mutation type */
export type MutationDeleteIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: DeleteIngestorStatsInput;
};

/** Root mutation type */
export type MutationDeleteLiquidationAddressArgs = {
  condition?: InputMaybe<ModelLiquidationAddressConditionInput>;
  input: DeleteLiquidationAddressInput;
};

/** Root mutation type */
export type MutationDeleteMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: DeleteMotionMessageInput;
};

/** Root mutation type */
export type MutationDeleteMultiSigUserSignatureArgs = {
  condition?: InputMaybe<ModelMultiSigUserSignatureConditionInput>;
  input: DeleteMultiSigUserSignatureInput;
};

/** Root mutation type */
export type MutationDeleteNotificationsDataArgs = {
  condition?: InputMaybe<ModelNotificationsDataConditionInput>;
  input: DeleteNotificationsDataInput;
};

/** Root mutation type */
export type MutationDeletePrivateBetaInviteCodeArgs = {
  condition?: InputMaybe<ModelPrivateBetaInviteCodeConditionInput>;
  input: DeletePrivateBetaInviteCodeInput;
};

/** Root mutation type */
export type MutationDeleteProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: DeleteProfileInput;
};

/** Root mutation type */
export type MutationDeleteProxyColonyArgs = {
  condition?: InputMaybe<ModelProxyColonyConditionInput>;
  input: DeleteProxyColonyInput;
};

/** Root mutation type */
export type MutationDeleteReputationMiningCycleMetadataArgs = {
  condition?: InputMaybe<ModelReputationMiningCycleMetadataConditionInput>;
  input: DeleteReputationMiningCycleMetadataInput;
};

/** Root mutation type */
export type MutationDeleteSafeTransactionArgs = {
  condition?: InputMaybe<ModelSafeTransactionConditionInput>;
  input: DeleteSafeTransactionInput;
};

/** Root mutation type */
export type MutationDeleteSafeTransactionDataArgs = {
  condition?: InputMaybe<ModelSafeTransactionDataConditionInput>;
  input: DeleteSafeTransactionDataInput;
};

/** Root mutation type */
export type MutationDeleteStreamingPaymentArgs = {
  condition?: InputMaybe<ModelStreamingPaymentConditionInput>;
  input: DeleteStreamingPaymentInput;
};

/** Root mutation type */
export type MutationDeleteStreamingPaymentMetadataArgs = {
  condition?: InputMaybe<ModelStreamingPaymentMetadataConditionInput>;
  input: DeleteStreamingPaymentMetadataInput;
};

/** Root mutation type */
export type MutationDeleteTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: DeleteTokenInput;
};

/** Root mutation type */
export type MutationDeleteTokenExchangeRateArgs = {
  condition?: InputMaybe<ModelTokenExchangeRateConditionInput>;
  input: DeleteTokenExchangeRateInput;
};

/** Root mutation type */
export type MutationDeleteTransactionArgs = {
  condition?: InputMaybe<ModelTransactionConditionInput>;
  input: DeleteTransactionInput;
};

/** Root mutation type */
export type MutationDeleteUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: DeleteUserInput;
};

/** Root mutation type */
export type MutationDeleteUserStakeArgs = {
  condition?: InputMaybe<ModelUserStakeConditionInput>;
  input: DeleteUserStakeInput;
};

/** Root mutation type */
export type MutationDeleteUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: DeleteUserTokensInput;
};

/** Root mutation type */
export type MutationDeleteVoterRewardsHistoryArgs = {
  condition?: InputMaybe<ModelVoterRewardsHistoryConditionInput>;
  input: DeleteVoterRewardsHistoryInput;
};

/** Root mutation type */
export type MutationInitializeUserArgs = {
  input: InitializeUserInput;
};

/** Root mutation type */
export type MutationUpdateAnnotationArgs = {
  condition?: InputMaybe<ModelAnnotationConditionInput>;
  input: UpdateAnnotationInput;
};

/** Root mutation type */
export type MutationUpdateCacheTotalBalanceArgs = {
  condition?: InputMaybe<ModelCacheTotalBalanceConditionInput>;
  input: UpdateCacheTotalBalanceInput;
};

/** Root mutation type */
export type MutationUpdateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: UpdateColonyInput;
};

/** Root mutation type */
export type MutationUpdateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: UpdateColonyActionInput;
};

/** Root mutation type */
export type MutationUpdateColonyActionMetadataArgs = {
  condition?: InputMaybe<ModelColonyActionMetadataConditionInput>;
  input: UpdateColonyActionMetadataInput;
};

/** Root mutation type */
export type MutationUpdateColonyContributorArgs = {
  condition?: InputMaybe<ModelColonyContributorConditionInput>;
  input: UpdateColonyContributorInput;
};

/** Root mutation type */
export type MutationUpdateColonyDecisionArgs = {
  condition?: InputMaybe<ModelColonyDecisionConditionInput>;
  input: UpdateColonyDecisionInput;
};

/** Root mutation type */
export type MutationUpdateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: UpdateColonyExtensionInput;
};

/** Root mutation type */
export type MutationUpdateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: UpdateColonyFundsClaimInput;
};

/** Root mutation type */
export type MutationUpdateColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: UpdateColonyHistoricRoleInput;
};

/** Root mutation type */
export type MutationUpdateColonyMemberInviteArgs = {
  condition?: InputMaybe<ModelColonyMemberInviteConditionInput>;
  input: UpdateColonyMemberInviteInput;
};

/** Root mutation type */
export type MutationUpdateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: UpdateColonyMetadataInput;
};

/** Root mutation type */
export type MutationUpdateColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: UpdateColonyMotionInput;
};

/** Root mutation type */
export type MutationUpdateColonyMultiSigArgs = {
  condition?: InputMaybe<ModelColonyMultiSigConditionInput>;
  input: UpdateColonyMultiSigInput;
};

/** Root mutation type */
export type MutationUpdateColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: UpdateColonyRoleInput;
};

/** Root mutation type */
export type MutationUpdateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: UpdateColonyTokensInput;
};

/** Root mutation type */
export type MutationUpdateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: UpdateContractEventInput;
};

/** Root mutation type */
export type MutationUpdateContributorReputationArgs = {
  condition?: InputMaybe<ModelContributorReputationConditionInput>;
  input: UpdateContributorReputationInput;
};

/** Root mutation type */
export type MutationUpdateContributorsWithReputationArgs = {
  input: UpdateContributorsWithReputationInput;
};

/** Root mutation type */
export type MutationUpdateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: UpdateCurrentNetworkInverseFeeInput;
};

/** Root mutation type */
export type MutationUpdateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: UpdateCurrentVersionInput;
};

/** Root mutation type */
export type MutationUpdateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: UpdateDomainInput;
};

/** Root mutation type */
export type MutationUpdateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: UpdateDomainMetadataInput;
};

/** Root mutation type */
export type MutationUpdateExpenditureArgs = {
  condition?: InputMaybe<ModelExpenditureConditionInput>;
  input: UpdateExpenditureInput;
};

/** Root mutation type */
export type MutationUpdateExpenditureMetadataArgs = {
  condition?: InputMaybe<ModelExpenditureMetadataConditionInput>;
  input: UpdateExpenditureMetadataInput;
};

/** Root mutation type */
export type MutationUpdateExtensionInstallationsCountArgs = {
  condition?: InputMaybe<ModelExtensionInstallationsCountConditionInput>;
  input: UpdateExtensionInstallationsCountInput;
};

/** Root mutation type */
export type MutationUpdateIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: UpdateIngestorStatsInput;
};

/** Root mutation type */
export type MutationUpdateLiquidationAddressArgs = {
  condition?: InputMaybe<ModelLiquidationAddressConditionInput>;
  input: UpdateLiquidationAddressInput;
};

/** Root mutation type */
export type MutationUpdateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: UpdateMotionMessageInput;
};

/** Root mutation type */
export type MutationUpdateMultiSigUserSignatureArgs = {
  condition?: InputMaybe<ModelMultiSigUserSignatureConditionInput>;
  input: UpdateMultiSigUserSignatureInput;
};

/** Root mutation type */
export type MutationUpdateNotificationsDataArgs = {
  condition?: InputMaybe<ModelNotificationsDataConditionInput>;
  input: UpdateNotificationsDataInput;
};

/** Root mutation type */
export type MutationUpdatePrivateBetaInviteCodeArgs = {
  condition?: InputMaybe<ModelPrivateBetaInviteCodeConditionInput>;
  input: UpdatePrivateBetaInviteCodeInput;
};

/** Root mutation type */
export type MutationUpdateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: UpdateProfileInput;
};

/** Root mutation type */
export type MutationUpdateProxyColonyArgs = {
  condition?: InputMaybe<ModelProxyColonyConditionInput>;
  input: UpdateProxyColonyInput;
};

/** Root mutation type */
export type MutationUpdateReputationMiningCycleMetadataArgs = {
  condition?: InputMaybe<ModelReputationMiningCycleMetadataConditionInput>;
  input: UpdateReputationMiningCycleMetadataInput;
};

/** Root mutation type */
export type MutationUpdateSafeTransactionArgs = {
  condition?: InputMaybe<ModelSafeTransactionConditionInput>;
  input: UpdateSafeTransactionInput;
};

/** Root mutation type */
export type MutationUpdateSafeTransactionDataArgs = {
  condition?: InputMaybe<ModelSafeTransactionDataConditionInput>;
  input: UpdateSafeTransactionDataInput;
};

/** Root mutation type */
export type MutationUpdateStreamingPaymentArgs = {
  condition?: InputMaybe<ModelStreamingPaymentConditionInput>;
  input: UpdateStreamingPaymentInput;
};

/** Root mutation type */
export type MutationUpdateStreamingPaymentMetadataArgs = {
  condition?: InputMaybe<ModelStreamingPaymentMetadataConditionInput>;
  input: UpdateStreamingPaymentMetadataInput;
};

/** Root mutation type */
export type MutationUpdateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: UpdateTokenInput;
};

/** Root mutation type */
export type MutationUpdateTokenExchangeRateArgs = {
  condition?: InputMaybe<ModelTokenExchangeRateConditionInput>;
  input: UpdateTokenExchangeRateInput;
};

/** Root mutation type */
export type MutationUpdateTransactionArgs = {
  condition?: InputMaybe<ModelTransactionConditionInput>;
  input: UpdateTransactionInput;
};

/** Root mutation type */
export type MutationUpdateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: UpdateUserInput;
};

/** Root mutation type */
export type MutationUpdateUserStakeArgs = {
  condition?: InputMaybe<ModelUserStakeConditionInput>;
  input: UpdateUserStakeInput;
};

/** Root mutation type */
export type MutationUpdateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: UpdateUserTokensInput;
};

/** Root mutation type */
export type MutationUpdateVoterRewardsHistoryArgs = {
  condition?: InputMaybe<ModelVoterRewardsHistoryConditionInput>;
  input: UpdateVoterRewardsHistoryInput;
};

/** Root mutation type */
export type MutationValidateUserInviteArgs = {
  input: ValidateUserInviteInput;
};

export type Nft = {
  __typename?: 'NFT';
  id: Scalars['String'];
  profile: NftProfile;
  walletAddress: Scalars['String'];
};

export type NftData = {
  __typename?: 'NFTData';
  address: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageUri?: Maybe<Scalars['String']>;
  logoUri: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  tokenName: Scalars['String'];
  tokenSymbol: Scalars['String'];
  uri: Scalars['String'];
};

export type NftDataInput = {
  address: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  imageUri?: InputMaybe<Scalars['String']>;
  logoUri: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  tokenName: Scalars['String'];
  tokenSymbol: Scalars['String'];
  uri: Scalars['String'];
};

export type NftInput = {
  id: Scalars['String'];
  profile: NftProfileInput;
  walletAddress: Scalars['String'];
};

export type NftProfile = {
  __typename?: 'NFTProfile';
  displayName: Scalars['String'];
};

export type NftProfileInput = {
  displayName: Scalars['String'];
};

/**
 * Represents the status of a Colony's native token
 * Colonies can have different types of native tokens in various modes. Here we define some important properties that the dApp uses to enable or disable certain features or views. This is set when a Colony is created and can be changed later
 */
export type NativeTokenStatus = {
  __typename?: 'NativeTokenStatus';
  /** Whether the user has permissions to mint new tokens */
  mintable?: Maybe<Scalars['Boolean']>;
  /** Whether the native token can be unlocked */
  unlockable?: Maybe<Scalars['Boolean']>;
  /** Whether the native token is unlocked */
  unlocked?: Maybe<Scalars['Boolean']>;
};

/** Colonies can have different types of native tokens in various modes. Here we define some important properties that the dApp uses to enable or disable certain features or views. This is set when a Colony is created and can be changed later */
export type NativeTokenStatusInput = {
  /** Whether the native token is mintable */
  mintable?: InputMaybe<Scalars['Boolean']>;
  /** Whether the native token can be unlocked */
  unlockable?: InputMaybe<Scalars['Boolean']>;
  /** Whether the native token is unlocked */
  unlocked?: InputMaybe<Scalars['Boolean']>;
};

/** Variants of supported Ethereum networks */
export enum Network {
  /** Local development network using Ganache */
  Ganache = 'GANACHE',
  /** Gnosis Chain network */
  Gnosis = 'GNOSIS',
  /** Fork of Gnosis Chain for QA purposes */
  Gnosisfork = 'GNOSISFORK',
  /** Ethereum Goerli test network */
  Goerli = 'GOERLI',
  /** Ethereum Mainnet */
  Mainnet = 'MAINNET',
}

/** Type of notifications that can be sent */
export enum NotificationType {
  ExpenditureCancelled = 'EXPENDITURE_CANCELLED',
  ExpenditureFinalized = 'EXPENDITURE_FINALIZED',
  ExpenditurePayoutClaimed = 'EXPENDITURE_PAYOUT_CLAIMED',
  ExpenditureReadyForFunding = 'EXPENDITURE_READY_FOR_FUNDING',
  ExpenditureReadyForRelease = 'EXPENDITURE_READY_FOR_RELEASE',
  ExpenditureReadyForReview = 'EXPENDITURE_READY_FOR_REVIEW',
  ExtensionDeprecated = 'EXTENSION_DEPRECATED',
  ExtensionEnabled = 'EXTENSION_ENABLED',
  ExtensionInstalled = 'EXTENSION_INSTALLED',
  ExtensionSettingsChanged = 'EXTENSION_SETTINGS_CHANGED',
  ExtensionUninstalled = 'EXTENSION_UNINSTALLED',
  ExtensionUpgraded = 'EXTENSION_UPGRADED',
  FundsClaimed = 'FUNDS_CLAIMED',
  Mention = 'MENTION',
  MotionCreated = 'MOTION_CREATED',
  MotionFinalized = 'MOTION_FINALIZED',
  MotionOpposed = 'MOTION_OPPOSED',
  MotionReveal = 'MOTION_REVEAL',
  MotionSupported = 'MOTION_SUPPORTED',
  MotionVoting = 'MOTION_VOTING',
  MultisigActionApproved = 'MULTISIG_ACTION_APPROVED',
  MultisigActionCreated = 'MULTISIG_ACTION_CREATED',
  MultisigActionFinalized = 'MULTISIG_ACTION_FINALIZED',
  MultisigActionRejected = 'MULTISIG_ACTION_REJECTED',
  NewColonyVersion = 'NEW_COLONY_VERSION',
  NewExtensionVersion = 'NEW_EXTENSION_VERSION',
  PermissionsAction = 'PERMISSIONS_ACTION',
}

/** Holds the notifications data for the user, such as their unique Magicbell user id, and their notifications preferences. */
export type NotificationsData = {
  __typename?: 'NotificationsData';
  /** Boolean to indicate if the user has disabled admin notifications */
  adminNotificationsDisabled: Scalars['Boolean'];
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the user in Magicbell */
  magicbellUserId: Scalars['ID'];
  /** Boolean to indicate if the user has disabled mention notifications */
  mentionNotificationsDisabled: Scalars['Boolean'];
  /** List of addresses of colonies that the user has muted */
  mutedColonyAddresses: Array<Scalars['ID']>;
  /** Boolean to indicate if the user has disabled notifications app wide */
  notificationsDisabled: Scalars['Boolean'];
  /** Boolean to indicate if the user has disabled payment notifications */
  paymentNotificationsDisabled: Scalars['Boolean'];
  updatedAt: Scalars['AWSDateTime'];
  /** Unique identifier for the user */
  userAddress: Scalars['ID'];
};

export type Payment = {
  __typename?: 'Payment';
  /** Payment amount, excluding network fee */
  amount: Scalars['String'];
  /** Network fee amount */
  networkFee?: Maybe<Scalars['String']>;
  recipientAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type PaymentInput = {
  amount: Scalars['String'];
  networkFee?: InputMaybe<Scalars['String']>;
  recipientAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type PrivateBetaInviteCode = {
  __typename?: 'PrivateBetaInviteCode';
  createdAt: Scalars['AWSDateTime'];
  /** The id functions as the invite code */
  id: Scalars['ID'];
  /**
   * This tracks the amount of invites this invite code is also allowed to generate
   * The default value relates to the initial user and their subsequent invitee
   */
  shareableInvites?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['AWSDateTime'];
  /** User ID associated with the Invite */
  userId?: Maybe<Scalars['ID']>;
};

/** Represents a user's profile within the Colony Network */
export type Profile = {
  __typename?: 'Profile';
  /** URL of the user's avatar image */
  avatar?: Maybe<Scalars['String']>;
  /** User's bio information */
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  /** Display name of the user */
  displayName?: Maybe<Scalars['String']>;
  /** Date displayName was changed */
  displayNameChanged?: Maybe<Scalars['AWSDateTime']>;
  /** User's email address */
  email?: Maybe<Scalars['AWSEmail']>;
  /**
   * Whether the user has completed the Persona KYC Flow
   * Note: This doesn't indicate the outcome of the KYC check
   */
  hasCompletedKYCFlow?: Maybe<Scalars['Boolean']>;
  /** Unique identifier for the user's profile */
  id: Scalars['ID'];
  /** Is automatic offramp enabled */
  isAutoOfframpEnabled?: Maybe<Scalars['Boolean']>;
  /** User's location information */
  location?: Maybe<Scalars['String']>;
  /** Metadata associated with the user's profile */
  meta?: Maybe<ProfileMetadata>;
  /** A user's prefered currency, for conversion purposes */
  preferredCurrency?: Maybe<SupportedCurrencies>;
  /** URL of the user's thumbnail image */
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  /** The user associated with this profile */
  user: User;
  /** URL of the user's website */
  website?: Maybe<Scalars['AWSURL']>;
};

/** Input data to use when creating or changing a user profile */
export type ProfileInput = {
  /** The URL of the user's avatar image */
  avatar?: InputMaybe<Scalars['String']>;
  /** A short description or biography of the user. */
  bio?: InputMaybe<Scalars['String']>;
  /** The display name of the user */
  displayName?: InputMaybe<Scalars['String']>;
  /** The user's email address */
  email?: InputMaybe<Scalars['AWSEmail']>;
  /** The unique identifier for the user profile */
  id?: InputMaybe<Scalars['ID']>;
  /** The user's location (e.g., city or country) */
  location?: InputMaybe<Scalars['String']>;
  /** Any additional metadata or settings related to the user profile */
  meta?: InputMaybe<ProfileMetadataInput>;
  /** The URL of the user's thumbnail image */
  thumbnail?: InputMaybe<Scalars['String']>;
  /** The user's personal or professional website */
  website?: InputMaybe<Scalars['AWSURL']>;
};

/** Represents metadata for a user's profile. Mostly user specific settings */
export type ProfileMetadata = {
  __typename?: 'ProfileMetadata';
  /** The URL of the user's custom RPC node */
  customRpc?: Maybe<Scalars['String']>;
  /** A flag to indicate whether the user has enabled the decentralized mode */
  decentralizedModeEnabled?: Maybe<Scalars['Boolean']>;
  /** A flag to indicate whether the user has enabled metatransactions */
  metatransactionsEnabled?: Maybe<Scalars['Boolean']>;
};

/** Input data for a user's profile metadata */
export type ProfileMetadataInput = {
  /** The URL of the user's custom RPC node */
  customRpc?: InputMaybe<Scalars['String']>;
  /** A flag to indicate whether the user has enabled the decentralized mode */
  decentralizedModeEnabled?: InputMaybe<Scalars['Boolean']>;
  /** A flag to indicate whether the user has enabled metatransactions */
  metatransactionsEnabled?: InputMaybe<Scalars['Boolean']>;
};

/** Table representing a deployed proxy colony */
export type ProxyColony = {
  __typename?: 'ProxyColony';
  /** The chainId it's deployed on */
  chainId: Scalars['String'];
  /** Address of the colony on the blockchain */
  colonyAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** id in the format of colonyAddress_chainId */
  id: Scalars['ID'];
  /** A flag that tells us if the proxy is active or not */
  isActive: Scalars['Boolean'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Root query type */
export type Query = {
  __typename?: 'Query';
  /** Check bridge KYC status for the current user */
  bridgeCheckKYC?: Maybe<BridgeCheckKycReturn>;
  /** Get drains history for the current user */
  bridgeGetDrainsHistory?: Maybe<Array<BridgeDrain>>;
  /** Get bridge gateway fee */
  bridgeGetGatewayFee?: Maybe<BridgeGatewayFeeReturn>;
  /** Get liquidation address of a given user */
  bridgeGetUserLiquidationAddress?: Maybe<Scalars['String']>;
  /** Trigger the balance caching */
  cacheAllDomainBalance?: Maybe<CacheAllDomainBalanceReturn>;
  cacheTotalBalanceByColonyAddress?: Maybe<ModelCacheTotalBalanceConnection>;
  getActionByExpenditureId?: Maybe<ModelColonyActionConnection>;
  getActionsByColony?: Maybe<ModelColonyActionConnection>;
  getAnnotation?: Maybe<Annotation>;
  getCacheTotalBalance?: Maybe<CacheTotalBalance>;
  getColoniesByNativeTokenId?: Maybe<ModelColonyConnection>;
  getColony?: Maybe<Colony>;
  getColonyAction?: Maybe<ColonyAction>;
  getColonyActionByMotionId?: Maybe<ModelColonyActionConnection>;
  getColonyActionByMultiSigId?: Maybe<ModelColonyActionConnection>;
  getColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  getColonyByAddress?: Maybe<ModelColonyConnection>;
  getColonyByName?: Maybe<ModelColonyConnection>;
  getColonyByType?: Maybe<ModelColonyConnection>;
  getColonyContributor?: Maybe<ColonyContributor>;
  getColonyDecision?: Maybe<ColonyDecision>;
  getColonyDecisionByActionId?: Maybe<ModelColonyDecisionConnection>;
  getColonyDecisionByColonyAddress?: Maybe<ModelColonyDecisionConnection>;
  getColonyExtension?: Maybe<ColonyExtension>;
  getColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  getColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  getColonyHistoricRoleByDate?: Maybe<ModelColonyHistoricRoleConnection>;
  getColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  getColonyMetadata?: Maybe<ColonyMetadata>;
  getColonyMotion?: Maybe<ColonyMotion>;
  getColonyMultiSig?: Maybe<ColonyMultiSig>;
  getColonyRole?: Maybe<ColonyRole>;
  getColonyTokens?: Maybe<ColonyTokens>;
  getContractEvent?: Maybe<ContractEvent>;
  getContributorReputation?: Maybe<ContributorReputation>;
  getContributorsByAddress?: Maybe<ModelColonyContributorConnection>;
  getContributorsByColony?: Maybe<ModelColonyContributorConnection>;
  getCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  getCurrentVersion?: Maybe<CurrentVersion>;
  getCurrentVersionByKey?: Maybe<ModelCurrentVersionConnection>;
  getDomain?: Maybe<Domain>;
  /** Fetch a domain total balance */
  getDomainBalance?: Maybe<DomainBalanceReturn>;
  getDomainByNativeSkillId?: Maybe<ModelDomainConnection>;
  getDomainMetadata?: Maybe<DomainMetadata>;
  getDomainsByColony?: Maybe<ModelDomainConnection>;
  getExpenditure?: Maybe<Expenditure>;
  getExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  getExpendituresByColony?: Maybe<ModelExpenditureConnection>;
  getExpendituresByNativeFundingPotIdAndColony?: Maybe<ModelExpenditureConnection>;
  getExtensionByColonyAndHash?: Maybe<ModelColonyExtensionConnection>;
  getExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  getExtensionsByHash?: Maybe<ModelColonyExtensionConnection>;
  getFundsClaimsByColony?: Maybe<ModelColonyFundsClaimConnection>;
  getIngestorStats?: Maybe<IngestorStats>;
  getLiquidationAddress?: Maybe<LiquidationAddress>;
  getLiquidationAddressesByUserAddress?: Maybe<ModelLiquidationAddressConnection>;
  getMotionByExpenditureId?: Maybe<ModelColonyMotionConnection>;
  getMotionByTransactionHash?: Maybe<ModelColonyMotionConnection>;
  getMotionMessage?: Maybe<MotionMessage>;
  getMotionMessageByMotionId?: Maybe<ModelMotionMessageConnection>;
  /** Get the state of a motion (i.e. the current period) */
  getMotionState: Scalars['Int'];
  /** Get the timeout for the current period of a motion */
  getMotionTimeoutPeriods?: Maybe<GetMotionTimeoutPeriodsReturn>;
  getMotionVoterRewards?: Maybe<ModelVoterRewardsHistoryConnection>;
  getMultiSigByColonyAddress?: Maybe<ModelColonyMultiSigConnection>;
  getMultiSigByExpenditureId?: Maybe<ModelColonyMultiSigConnection>;
  getMultiSigByTransactionHash?: Maybe<ModelColonyMultiSigConnection>;
  getMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  getMultiSigUserSignatureByMultiSigId?: Maybe<ModelMultiSigUserSignatureConnection>;
  getNotificationsData?: Maybe<NotificationsData>;
  getPrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  getProfile?: Maybe<Profile>;
  getProfileByEmail?: Maybe<ModelProfileConnection>;
  getProfileByUsername?: Maybe<ModelProfileConnection>;
  getProxyColony?: Maybe<ProxyColony>;
  getReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  getRoleByColony?: Maybe<ModelColonyRoleConnection>;
  getRoleByDomainAndColony?: Maybe<ModelColonyRoleConnection>;
  getRoleByTargetAddressAndColony?: Maybe<ModelColonyRoleConnection>;
  getSafeTransaction?: Maybe<SafeTransaction>;
  getSafeTransactionData?: Maybe<SafeTransactionData>;
  getSafeTransactionStatus?: Maybe<Array<Scalars['String']>>;
  getStreamingPayment?: Maybe<StreamingPayment>;
  getStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  getToken?: Maybe<Token>;
  getTokenByAddress?: Maybe<ModelTokenConnection>;
  getTokenExchangeRate?: Maybe<TokenExchangeRate>;
  /** Fetch a token's information. Tries to get the data from the DB first, if that fails, resolves to get data from chain */
  getTokenFromEverywhere?: Maybe<TokenFromEverywhereReturn>;
  getTokensByType?: Maybe<ModelTokenConnection>;
  getTransaction?: Maybe<Transaction>;
  getTransactionsByUser?: Maybe<ModelTransactionConnection>;
  getTransactionsByUserAndGroup?: Maybe<ModelTransactionConnection>;
  getUser?: Maybe<User>;
  getUserByAddress?: Maybe<ModelUserConnection>;
  getUserByBridgeCustomerId?: Maybe<ModelUserConnection>;
  getUserByLiquidationAddress?: Maybe<ModelLiquidationAddressConnection>;
  /** Generate key for the user in Magicbell, used for secure fetching of notifications */
  getUserNotificationsHMAC?: Maybe<Scalars['String']>;
  /** Retrieve a user's reputation within a specific domain in a Colony */
  getUserReputation?: Maybe<Scalars['String']>;
  getUserReputationInColony?: Maybe<ModelContributorReputationConnection>;
  getUserStake?: Maybe<UserStake>;
  getUserStakes?: Maybe<ModelUserStakeConnection>;
  /** Retrieve a user's token balance for a specific token */
  getUserTokenBalance?: Maybe<GetUserTokenBalanceReturn>;
  getUserTokens?: Maybe<UserTokens>;
  getUserVoterRewards?: Maybe<ModelVoterRewardsHistoryConnection>;
  /** Get the voting reward for a user and a motion */
  getVoterRewards?: Maybe<VoterRewardsReturn>;
  getVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
  listAnnotations?: Maybe<ModelAnnotationConnection>;
  listCacheTotalBalances?: Maybe<ModelCacheTotalBalanceConnection>;
  listColonies?: Maybe<ModelColonyConnection>;
  listColonyActionMetadata?: Maybe<ModelColonyActionMetadataConnection>;
  listColonyActions?: Maybe<ModelColonyActionConnection>;
  listColonyContributors?: Maybe<ModelColonyContributorConnection>;
  listColonyDecisions?: Maybe<ModelColonyDecisionConnection>;
  listColonyExtensions?: Maybe<ModelColonyExtensionConnection>;
  listColonyFundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  listColonyHistoricRoles?: Maybe<ModelColonyHistoricRoleConnection>;
  listColonyMemberInvites?: Maybe<ModelColonyMemberInviteConnection>;
  listColonyMetadata?: Maybe<ModelColonyMetadataConnection>;
  listColonyMotions?: Maybe<ModelColonyMotionConnection>;
  listColonyMultiSigs?: Maybe<ModelColonyMultiSigConnection>;
  listColonyRoles?: Maybe<ModelColonyRoleConnection>;
  listColonyTokens?: Maybe<ModelColonyTokensConnection>;
  listContractEvents?: Maybe<ModelContractEventConnection>;
  listContributorReputations?: Maybe<ModelContributorReputationConnection>;
  listCurrentNetworkInverseFees?: Maybe<ModelCurrentNetworkInverseFeeConnection>;
  listCurrentVersions?: Maybe<ModelCurrentVersionConnection>;
  listDomainMetadata?: Maybe<ModelDomainMetadataConnection>;
  listDomains?: Maybe<ModelDomainConnection>;
  listExpenditureMetadata?: Maybe<ModelExpenditureMetadataConnection>;
  listExpenditures?: Maybe<ModelExpenditureConnection>;
  listExtensionInstallationsCounts?: Maybe<ModelExtensionInstallationsCountConnection>;
  listIngestorStats?: Maybe<ModelIngestorStatsConnection>;
  listLiquidationAddresses?: Maybe<ModelLiquidationAddressConnection>;
  listMotionMessages?: Maybe<ModelMotionMessageConnection>;
  listMultiSigUserSignatures?: Maybe<ModelMultiSigUserSignatureConnection>;
  listNotificationsData?: Maybe<ModelNotificationsDataConnection>;
  listPrivateBetaInviteCodes?: Maybe<ModelPrivateBetaInviteCodeConnection>;
  listProfiles?: Maybe<ModelProfileConnection>;
  listProxyColonies?: Maybe<ModelProxyColonyConnection>;
  listReputationMiningCycleMetadata?: Maybe<ModelReputationMiningCycleMetadataConnection>;
  listSafeTransactionData?: Maybe<ModelSafeTransactionDataConnection>;
  listSafeTransactions?: Maybe<ModelSafeTransactionConnection>;
  listStreamingPaymentMetadata?: Maybe<ModelStreamingPaymentMetadataConnection>;
  listStreamingPayments?: Maybe<ModelStreamingPaymentConnection>;
  listTokenExchangeRates?: Maybe<ModelTokenExchangeRateConnection>;
  listTokens?: Maybe<ModelTokenConnection>;
  listTransactions?: Maybe<ModelTransactionConnection>;
  listUserStakes?: Maybe<ModelUserStakeConnection>;
  listUserTokens?: Maybe<ModelUserTokensConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  listVoterRewardsHistories?: Maybe<ModelVoterRewardsHistoryConnection>;
  searchColonyActions?: Maybe<SearchableColonyActionConnection>;
  searchColonyContributors?: Maybe<SearchableColonyContributorConnection>;
  tokenExhangeRateByTokenId?: Maybe<ModelTokenExchangeRateConnection>;
};

/** Root query type */
export type QueryBridgeGetUserLiquidationAddressArgs = {
  userAddress: Scalars['String'];
};

/** Root query type */
export type QueryCacheTotalBalanceByColonyAddressArgs = {
  colonyAddress: Scalars['ID'];
  date?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelCacheTotalBalanceFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetActionByExpenditureIdArgs = {
  expenditureId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetActionsByColonyArgs = {
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetAnnotationArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetCacheTotalBalanceArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColoniesByNativeTokenIdArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeTokenId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyActionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyActionByMotionIdArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyActionByMultiSigIdArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  multiSigId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyActionMetadataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyByAddressArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyByNameArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyByTypeArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: ColonyType;
};

/** Root query type */
export type QueryGetColonyContributorArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyDecisionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyDecisionByActionIdArgs = {
  actionId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyDecisionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyDecisionByColonyAddressArgs = {
  colonyAddress: Scalars['String'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyDecisionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetColonyExtensionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyFundsClaimArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyHistoricRoleArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyHistoricRoleByDateArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: Scalars['String'];
};

/** Root query type */
export type QueryGetColonyMemberInviteArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyMetadataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyMotionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyMultiSigArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyRoleArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetColonyTokensArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetContractEventArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetContributorReputationArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetContributorsByAddressArgs = {
  colonyReputationPercentage?: InputMaybe<ModelFloatKeyConditionInput>;
  contributorAddress: Scalars['ID'];
  filter?: InputMaybe<ModelColonyContributorFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetContributorsByColonyArgs = {
  colonyAddress: Scalars['ID'];
  colonyReputationPercentage?: InputMaybe<ModelFloatKeyConditionInput>;
  filter?: InputMaybe<ModelColonyContributorFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetCurrentNetworkInverseFeeArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetCurrentVersionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetCurrentVersionByKeyArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  key: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetDomainArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetDomainBalanceArgs = {
  input: DomainBalanceArguments;
};

/** Root query type */
export type QueryGetDomainByNativeSkillIdArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<ModelIntKeyConditionInput>;
  nativeSkillId: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetDomainMetadataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetDomainsByColonyArgs = {
  colonyId: Scalars['ID'];
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<ModelIntKeyConditionInput>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetExpenditureArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetExpenditureMetadataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetExpendituresByColonyArgs = {
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetExpendituresByNativeFundingPotIdAndColonyArgs = {
  colonyId?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeFundingPotId: Scalars['Int'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetExtensionByColonyAndHashArgs = {
  colonyId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetExtensionInstallationsCountArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetExtensionsByHashArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetFundsClaimsByColonyArgs = {
  colonyFundsClaimsId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetIngestorStatsArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetLiquidationAddressArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetLiquidationAddressesByUserAddressArgs = {
  filter?: InputMaybe<ModelLiquidationAddressFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userAddress: Scalars['ID'];
};

/** Root query type */
export type QueryGetMotionByExpenditureIdArgs = {
  expenditureId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyMotionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetMotionByTransactionHashArgs = {
  filter?: InputMaybe<ModelColonyMotionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  transactionHash: Scalars['ID'];
};

/** Root query type */
export type QueryGetMotionMessageArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetMotionMessageByMotionIdArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetMotionStateArgs = {
  input?: InputMaybe<GetMotionStateInput>;
};

/** Root query type */
export type QueryGetMotionTimeoutPeriodsArgs = {
  input?: InputMaybe<GetMotionTimeoutPeriodsInput>;
};

/** Root query type */
export type QueryGetMotionVoterRewardsArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelVoterRewardsHistoryFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetMultiSigByColonyAddressArgs = {
  colonyAddress: Scalars['ID'];
  filter?: InputMaybe<ModelColonyMultiSigFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetMultiSigByExpenditureIdArgs = {
  expenditureId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyMultiSigFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetMultiSigByTransactionHashArgs = {
  filter?: InputMaybe<ModelColonyMultiSigFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  transactionHash: Scalars['ID'];
};

/** Root query type */
export type QueryGetMultiSigUserSignatureArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetMultiSigUserSignatureByMultiSigIdArgs = {
  filter?: InputMaybe<ModelMultiSigUserSignatureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  multiSigId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetNotificationsDataArgs = {
  userAddress: Scalars['ID'];
};

/** Root query type */
export type QueryGetPrivateBetaInviteCodeArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetProfileArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetProfileByEmailArgs = {
  email: Scalars['AWSEmail'];
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetProfileByUsernameArgs = {
  displayName: Scalars['String'];
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetProxyColonyArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetReputationMiningCycleMetadataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetRoleByColonyArgs = {
  colonyAddress: Scalars['ID'];
  domainId?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetRoleByDomainAndColonyArgs = {
  colonyAddress?: InputMaybe<ModelIdKeyConditionInput>;
  domainId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetRoleByTargetAddressAndColonyArgs = {
  colonyAddress?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  targetAddress: Scalars['ID'];
};

/** Root query type */
export type QueryGetSafeTransactionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetSafeTransactionDataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetSafeTransactionStatusArgs = {
  input?: InputMaybe<GetSafeTransactionStatusInput>;
};

/** Root query type */
export type QueryGetStreamingPaymentArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetStreamingPaymentMetadataArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetTokenArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetTokenByAddressArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetTokenExchangeRateArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetTokenFromEverywhereArgs = {
  input?: InputMaybe<TokenFromEverywhereArguments>;
};

/** Root query type */
export type QueryGetTokensByTypeArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: TokenType;
};

/** Root query type */
export type QueryGetTransactionArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetTransactionsByUserArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelTransactionFilterInput>;
  from: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetTransactionsByUserAndGroupArgs = {
  filter?: InputMaybe<ModelTransactionFilterInput>;
  from?: InputMaybe<ModelIdKeyConditionInput>;
  groupId: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetUserByAddressArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetUserByBridgeCustomerIdArgs = {
  bridgeCustomerId: Scalars['String'];
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetUserByLiquidationAddressArgs = {
  filter?: InputMaybe<ModelLiquidationAddressFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  liquidationAddress: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetUserReputationArgs = {
  input?: InputMaybe<GetUserReputationInput>;
};

/** Root query type */
export type QueryGetUserReputationInColonyArgs = {
  colonyAddress?: InputMaybe<ModelIdKeyConditionInput>;
  contributorAddress: Scalars['ID'];
  filter?: InputMaybe<ModelContributorReputationFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Root query type */
export type QueryGetUserStakeArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetUserStakesArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelUserStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userAddress: Scalars['ID'];
};

/** Root query type */
export type QueryGetUserTokenBalanceArgs = {
  input?: InputMaybe<GetUserTokenBalanceInput>;
};

/** Root query type */
export type QueryGetUserTokensArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryGetUserVoterRewardsArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelVoterRewardsHistoryFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userAddress: Scalars['ID'];
};

/** Root query type */
export type QueryGetVoterRewardsArgs = {
  input?: InputMaybe<GetVoterRewardsInput>;
};

/** Root query type */
export type QueryGetVoterRewardsHistoryArgs = {
  id: Scalars['ID'];
};

/** Root query type */
export type QueryListAnnotationsArgs = {
  filter?: InputMaybe<ModelAnnotationFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListCacheTotalBalancesArgs = {
  filter?: InputMaybe<ModelCacheTotalBalanceFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColoniesArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyActionMetadataArgs = {
  filter?: InputMaybe<ModelColonyActionMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyContributorsArgs = {
  filter?: InputMaybe<ModelColonyContributorFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyDecisionsArgs = {
  filter?: InputMaybe<ModelColonyDecisionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyHistoricRolesArgs = {
  filter?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyMemberInvitesArgs = {
  filter?: InputMaybe<ModelColonyMemberInviteFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyMetadataArgs = {
  filter?: InputMaybe<ModelColonyMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyMotionsArgs = {
  filter?: InputMaybe<ModelColonyMotionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyMultiSigsArgs = {
  filter?: InputMaybe<ModelColonyMultiSigFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListContractEventsArgs = {
  filter?: InputMaybe<ModelContractEventFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListContributorReputationsArgs = {
  filter?: InputMaybe<ModelContributorReputationFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListCurrentNetworkInverseFeesArgs = {
  filter?: InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListCurrentVersionsArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListDomainMetadataArgs = {
  filter?: InputMaybe<ModelDomainMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListExpenditureMetadataArgs = {
  filter?: InputMaybe<ModelExpenditureMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListExpendituresArgs = {
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListExtensionInstallationsCountsArgs = {
  filter?: InputMaybe<ModelExtensionInstallationsCountFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListIngestorStatsArgs = {
  filter?: InputMaybe<ModelIngestorStatsFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListLiquidationAddressesArgs = {
  filter?: InputMaybe<ModelLiquidationAddressFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListMotionMessagesArgs = {
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListMultiSigUserSignaturesArgs = {
  filter?: InputMaybe<ModelMultiSigUserSignatureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListNotificationsDataArgs = {
  filter?: InputMaybe<ModelNotificationsDataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userAddress?: InputMaybe<Scalars['ID']>;
};

/** Root query type */
export type QueryListPrivateBetaInviteCodesArgs = {
  filter?: InputMaybe<ModelPrivateBetaInviteCodeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListProfilesArgs = {
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListProxyColoniesArgs = {
  filter?: InputMaybe<ModelProxyColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListReputationMiningCycleMetadataArgs = {
  filter?: InputMaybe<ModelReputationMiningCycleMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListSafeTransactionDataArgs = {
  filter?: InputMaybe<ModelSafeTransactionDataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListSafeTransactionsArgs = {
  filter?: InputMaybe<ModelSafeTransactionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListStreamingPaymentMetadataArgs = {
  filter?: InputMaybe<ModelStreamingPaymentMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListStreamingPaymentsArgs = {
  filter?: InputMaybe<ModelStreamingPaymentFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListTokenExchangeRatesArgs = {
  filter?: InputMaybe<ModelTokenExchangeRateFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListTokensArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListTransactionsArgs = {
  filter?: InputMaybe<ModelTransactionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListUserStakesArgs = {
  filter?: InputMaybe<ModelUserStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListUserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListUsersArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QueryListVoterRewardsHistoriesArgs = {
  filter?: InputMaybe<ModelVoterRewardsHistoryFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/** Root query type */
export type QuerySearchColonyActionsArgs = {
  aggregates?: InputMaybe<
    Array<InputMaybe<SearchableColonyActionAggregationInput>>
  >;
  filter?: InputMaybe<SearchableColonyActionFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableColonyActionSortInput>>>;
};

/** Root query type */
export type QuerySearchColonyContributorsArgs = {
  aggregates?: InputMaybe<
    Array<InputMaybe<SearchableColonyContributorAggregationInput>>
  >;
  filter?: InputMaybe<SearchableColonyContributorFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableColonyContributorSortInput>>>;
};

/** Root query type */
export type QueryTokenExhangeRateByTokenIdArgs = {
  date?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelTokenExchangeRateFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  tokenId: Scalars['String'];
};

export type ReputationMiningCycleMetadata = {
  __typename?: 'ReputationMiningCycleMetadata';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  /** The timestamp of the most recent reputation mining cycle completion. */
  lastCompletedAt: Scalars['AWSDateTime'];
  updatedAt: Scalars['AWSDateTime'];
};

export type Safe = {
  __typename?: 'Safe';
  address: Scalars['String'];
  chainId: Scalars['String'];
  moduleContractAddress: Scalars['String'];
  name: Scalars['String'];
};

export type SafeInput = {
  address: Scalars['String'];
  chainId: Scalars['String'];
  moduleContractAddress: Scalars['String'];
  name: Scalars['String'];
};

export type SafeTransaction = {
  __typename?: 'SafeTransaction';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  safe: Safe;
  transactions?: Maybe<ModelSafeTransactionDataConnection>;
  updatedAt: Scalars['AWSDateTime'];
};

export type SafeTransactionTransactionsArgs = {
  filter?: InputMaybe<ModelSafeTransactionDataFilterInput>;
  id?: InputMaybe<ModelIdKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type SafeTransactionData = {
  __typename?: 'SafeTransactionData';
  abi?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  contract?: Maybe<SimpleTarget>;
  contractFunction?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  data?: Maybe<Scalars['String']>;
  functionParams?: Maybe<Array<Maybe<FunctionParam>>>;
  id: Scalars['ID'];
  nft?: Maybe<Nft>;
  nftData?: Maybe<NftData>;
  rawAmount?: Maybe<Scalars['String']>;
  recipient?: Maybe<SimpleTarget>;
  token?: Maybe<Token>;
  tokenAddress?: Maybe<Scalars['ID']>;
  transactionHash: Scalars['ID'];
  transactionType: SafeTransactionType;
  updatedAt: Scalars['AWSDateTime'];
};

export enum SafeTransactionType {
  ContractInteraction = 'CONTRACT_INTERACTION',
  RawTransaction = 'RAW_TRANSACTION',
  TransferFunds = 'TRANSFER_FUNDS',
  TransferNft = 'TRANSFER_NFT',
}

export type SearchableAggregateBucketResult = {
  __typename?: 'SearchableAggregateBucketResult';
  buckets?: Maybe<Array<Maybe<SearchableAggregateBucketResultItem>>>;
};

export type SearchableAggregateBucketResultItem = {
  __typename?: 'SearchableAggregateBucketResultItem';
  doc_count: Scalars['Int'];
  key: Scalars['String'];
};

export type SearchableAggregateGenericResult =
  | SearchableAggregateBucketResult
  | SearchableAggregateScalarResult;

export type SearchableAggregateResult = {
  __typename?: 'SearchableAggregateResult';
  name: Scalars['String'];
  result?: Maybe<SearchableAggregateGenericResult>;
};

export type SearchableAggregateScalarResult = {
  __typename?: 'SearchableAggregateScalarResult';
  value: Scalars['Float'];
};

export enum SearchableAggregateType {
  Avg = 'avg',
  Max = 'max',
  Min = 'min',
  Sum = 'sum',
  Terms = 'terms',
}

export type SearchableBooleanFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export enum SearchableColonyActionAggregateField {
  Amount = 'amount',
  AnnotationId = 'annotationId',
  BlockNumber = 'blockNumber',
  ColonyActionsId = 'colonyActionsId',
  ColonyDecisionId = 'colonyDecisionId',
  ColonyId = 'colonyId',
  CreatedAt = 'createdAt',
  ExpenditureId = 'expenditureId',
  ExpenditureSlotIds = 'expenditureSlotIds',
  FromDomainId = 'fromDomainId',
  FromPotId = 'fromPotId',
  Id = 'id',
  IndividualEvents = 'individualEvents',
  InitiatorAddress = 'initiatorAddress',
  IsMotion = 'isMotion',
  IsMotionFinalization = 'isMotionFinalization',
  IsMultiSig = 'isMultiSig',
  Members = 'members',
  MotionDomainId = 'motionDomainId',
  MotionId = 'motionId',
  MultiSigId = 'multiSigId',
  NetworkFee = 'networkFee',
  NewColonyVersion = 'newColonyVersion',
  PaymentId = 'paymentId',
  PendingColonyMetadataId = 'pendingColonyMetadataId',
  PendingDomainMetadataId = 'pendingDomainMetadataId',
  RecipientAddress = 'recipientAddress',
  RolesAreMultiSig = 'rolesAreMultiSig',
  RootHash = 'rootHash',
  ShowInActionsList = 'showInActionsList',
  ToDomainId = 'toDomainId',
  ToPotId = 'toPotId',
  TokenAddress = 'tokenAddress',
  Type = 'type',
  UpdatedAt = 'updatedAt',
}

export type SearchableColonyActionAggregationInput = {
  field: SearchableColonyActionAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
};

export type SearchableColonyActionConnection = {
  __typename?: 'SearchableColonyActionConnection';
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<ColonyAction>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type SearchableColonyActionFilterInput = {
  amount?: InputMaybe<SearchableStringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<SearchableColonyActionFilterInput>>>;
  annotationId?: InputMaybe<SearchableIdFilterInput>;
  blockNumber?: InputMaybe<SearchableIntFilterInput>;
  colonyActionsId?: InputMaybe<SearchableIdFilterInput>;
  colonyDecisionId?: InputMaybe<SearchableIdFilterInput>;
  colonyId?: InputMaybe<SearchableIdFilterInput>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  expenditureId?: InputMaybe<SearchableIdFilterInput>;
  expenditureSlotIds?: InputMaybe<SearchableIntFilterInput>;
  fromDomainId?: InputMaybe<SearchableIdFilterInput>;
  fromPotId?: InputMaybe<SearchableIntFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  individualEvents?: InputMaybe<SearchableStringFilterInput>;
  initiatorAddress?: InputMaybe<SearchableIdFilterInput>;
  isMotion?: InputMaybe<SearchableBooleanFilterInput>;
  isMotionFinalization?: InputMaybe<SearchableBooleanFilterInput>;
  isMultiSig?: InputMaybe<SearchableBooleanFilterInput>;
  members?: InputMaybe<SearchableIdFilterInput>;
  motionDomainId?: InputMaybe<SearchableIntFilterInput>;
  motionId?: InputMaybe<SearchableIdFilterInput>;
  multiSigId?: InputMaybe<SearchableIdFilterInput>;
  networkFee?: InputMaybe<SearchableStringFilterInput>;
  newColonyVersion?: InputMaybe<SearchableIntFilterInput>;
  not?: InputMaybe<SearchableColonyActionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableColonyActionFilterInput>>>;
  paymentId?: InputMaybe<SearchableIntFilterInput>;
  pendingColonyMetadataId?: InputMaybe<SearchableIdFilterInput>;
  pendingDomainMetadataId?: InputMaybe<SearchableIdFilterInput>;
  recipientAddress?: InputMaybe<SearchableIdFilterInput>;
  rolesAreMultiSig?: InputMaybe<SearchableBooleanFilterInput>;
  rootHash?: InputMaybe<SearchableStringFilterInput>;
  showInActionsList?: InputMaybe<SearchableBooleanFilterInput>;
  toDomainId?: InputMaybe<SearchableIdFilterInput>;
  toPotId?: InputMaybe<SearchableIntFilterInput>;
  tokenAddress?: InputMaybe<SearchableIdFilterInput>;
  type?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
};

export type SearchableColonyActionSortInput = {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableColonyActionSortableFields>;
};

export enum SearchableColonyActionSortableFields {
  Amount = 'amount',
  AnnotationId = 'annotationId',
  BlockNumber = 'blockNumber',
  ColonyActionsId = 'colonyActionsId',
  ColonyDecisionId = 'colonyDecisionId',
  ColonyId = 'colonyId',
  CreatedAt = 'createdAt',
  ExpenditureId = 'expenditureId',
  ExpenditureSlotIds = 'expenditureSlotIds',
  FromDomainId = 'fromDomainId',
  FromPotId = 'fromPotId',
  Id = 'id',
  IndividualEvents = 'individualEvents',
  InitiatorAddress = 'initiatorAddress',
  IsMotion = 'isMotion',
  IsMotionFinalization = 'isMotionFinalization',
  IsMultiSig = 'isMultiSig',
  Members = 'members',
  MotionDomainId = 'motionDomainId',
  MotionId = 'motionId',
  MultiSigId = 'multiSigId',
  NetworkFee = 'networkFee',
  NewColonyVersion = 'newColonyVersion',
  PaymentId = 'paymentId',
  PendingColonyMetadataId = 'pendingColonyMetadataId',
  PendingDomainMetadataId = 'pendingDomainMetadataId',
  RecipientAddress = 'recipientAddress',
  RolesAreMultiSig = 'rolesAreMultiSig',
  RootHash = 'rootHash',
  ShowInActionsList = 'showInActionsList',
  ToDomainId = 'toDomainId',
  ToPotId = 'toPotId',
  TokenAddress = 'tokenAddress',
  UpdatedAt = 'updatedAt',
}

export enum SearchableColonyContributorAggregateField {
  ColonyAddress = 'colonyAddress',
  ColonyReputationPercentage = 'colonyReputationPercentage',
  ContributorAddress = 'contributorAddress',
  CreatedAt = 'createdAt',
  HasPermissions = 'hasPermissions',
  HasReputation = 'hasReputation',
  Id = 'id',
  IsVerified = 'isVerified',
  IsWatching = 'isWatching',
  Type = 'type',
  UpdatedAt = 'updatedAt',
}

export type SearchableColonyContributorAggregationInput = {
  field: SearchableColonyContributorAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
};

export type SearchableColonyContributorConnection = {
  __typename?: 'SearchableColonyContributorConnection';
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<ColonyContributor>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type SearchableColonyContributorFilterInput = {
  and?: InputMaybe<Array<InputMaybe<SearchableColonyContributorFilterInput>>>;
  colonyAddress?: InputMaybe<SearchableIdFilterInput>;
  colonyReputationPercentage?: InputMaybe<SearchableFloatFilterInput>;
  contributorAddress?: InputMaybe<SearchableIdFilterInput>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  hasPermissions?: InputMaybe<SearchableBooleanFilterInput>;
  hasReputation?: InputMaybe<SearchableBooleanFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  isVerified?: InputMaybe<SearchableBooleanFilterInput>;
  isWatching?: InputMaybe<SearchableBooleanFilterInput>;
  not?: InputMaybe<SearchableColonyContributorFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableColonyContributorFilterInput>>>;
  type?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
};

export type SearchableColonyContributorSortInput = {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableColonyContributorSortableFields>;
};

export enum SearchableColonyContributorSortableFields {
  ColonyAddress = 'colonyAddress',
  ColonyReputationPercentage = 'colonyReputationPercentage',
  ContributorAddress = 'contributorAddress',
  CreatedAt = 'createdAt',
  HasPermissions = 'hasPermissions',
  HasReputation = 'hasReputation',
  Id = 'id',
  IsVerified = 'isVerified',
  IsWatching = 'isWatching',
  UpdatedAt = 'updatedAt',
}

export type SearchableFloatFilterInput = {
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

export type SearchableIdFilterInput = {
  eq?: InputMaybe<Scalars['ID']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['ID']>;
  gte?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  lte?: InputMaybe<Scalars['ID']>;
  match?: InputMaybe<Scalars['ID']>;
  matchPhrase?: InputMaybe<Scalars['ID']>;
  matchPhrasePrefix?: InputMaybe<Scalars['ID']>;
  multiMatch?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  regexp?: InputMaybe<Scalars['ID']>;
  wildcard?: InputMaybe<Scalars['ID']>;
};

export type SearchableIntFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum SearchableSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type SearchableStringFilterInput = {
  eq?: InputMaybe<Scalars['String']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  match?: InputMaybe<Scalars['String']>;
  matchPhrase?: InputMaybe<Scalars['String']>;
  matchPhrasePrefix?: InputMaybe<Scalars['String']>;
  multiMatch?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  regexp?: InputMaybe<Scalars['String']>;
  wildcard?: InputMaybe<Scalars['String']>;
};

export type SimpleTarget = {
  __typename?: 'SimpleTarget';
  id: Scalars['String'];
  profile: SimpleTargetProfile;
  walletAddress: Scalars['String'];
};

export type SimpleTargetInput = {
  id: Scalars['String'];
  profile: SimpleTargetProfileInput;
  walletAddress: Scalars['String'];
};

export type SimpleTargetProfile = {
  __typename?: 'SimpleTargetProfile';
  avatarHash?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
};

export type SimpleTargetProfileInput = {
  avatarHash?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
};

/** Variants of sorting methods for a member list */
export enum SortingMethod {
  /** Sort members by highest reputation */
  ByHighestRep = 'BY_HIGHEST_REP',
  /** Sort members by having fewer permissions */
  ByLessPermissions = 'BY_LESS_PERMISSIONS',
  /** Sort members by lowest reputation */
  ByLowestRep = 'BY_LOWEST_REP',
  /** Sort members by having more permissions */
  ByMorePermissions = 'BY_MORE_PERMISSIONS',
}

export enum SplitPaymentDistributionType {
  Equal = 'EQUAL',
  Reputation = 'REPUTATION',
  Unequal = 'UNEQUAL',
}

export type StakedExpenditureParams = {
  __typename?: 'StakedExpenditureParams';
  stakeFraction: Scalars['String'];
};

export type StakedExpenditureParamsInput = {
  stakeFraction: Scalars['String'];
};

/** Staker rewards of a user for a motion */
export type StakerRewards = {
  __typename?: 'StakerRewards';
  /** The user's wallet address */
  address: Scalars['String'];
  /** Whether the voter reward is already claimed or not */
  isClaimed: Scalars['Boolean'];
  /** Rewards associated with the staked sides of a motion */
  rewards: MotionStakeValues;
};

/** Input used to modify the staker rewards of a user for a motion */
export type StakerRewardsInput = {
  /** The user's wallet address */
  address: Scalars['String'];
  /** Whether the voter reward is already claimed or not */
  isClaimed: Scalars['Boolean'];
  /** Rewards associated with the staked sides of a motion */
  rewards: MotionStakeValuesInput;
};

export type StreamingPayment = {
  __typename?: 'StreamingPayment';
  createdAt: Scalars['AWSDateTime'];
  endTime: Scalars['AWSTimestamp'];
  id: Scalars['ID'];
  interval: Scalars['String'];
  metadata?: Maybe<StreamingPaymentMetadata>;
  nativeDomainId: Scalars['Int'];
  nativeId: Scalars['Int'];
  payouts?: Maybe<Array<ExpenditurePayout>>;
  recipientAddress: Scalars['String'];
  startTime: Scalars['AWSTimestamp'];
  updatedAt: Scalars['AWSDateTime'];
};

export enum StreamingPaymentEndCondition {
  FixedTime = 'FIXED_TIME',
  LimitReached = 'LIMIT_REACHED',
  WhenCancelled = 'WHEN_CANCELLED',
}

export type StreamingPaymentMetadata = {
  __typename?: 'StreamingPaymentMetadata';
  createdAt: Scalars['AWSDateTime'];
  endCondition: StreamingPaymentEndCondition;
  id: Scalars['ID'];
  limitAmount?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateAnnotation?: Maybe<Annotation>;
  onCreateCacheTotalBalance?: Maybe<CacheTotalBalance>;
  onCreateColony?: Maybe<Colony>;
  onCreateColonyAction?: Maybe<ColonyAction>;
  onCreateColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  onCreateColonyContributor?: Maybe<ColonyContributor>;
  onCreateColonyDecision?: Maybe<ColonyDecision>;
  onCreateColonyExtension?: Maybe<ColonyExtension>;
  onCreateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onCreateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onCreateColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  onCreateColonyMetadata?: Maybe<ColonyMetadata>;
  onCreateColonyMotion?: Maybe<ColonyMotion>;
  onCreateColonyMultiSig?: Maybe<ColonyMultiSig>;
  onCreateColonyRole?: Maybe<ColonyRole>;
  onCreateColonyTokens?: Maybe<ColonyTokens>;
  onCreateContractEvent?: Maybe<ContractEvent>;
  onCreateContributorReputation?: Maybe<ContributorReputation>;
  onCreateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onCreateCurrentVersion?: Maybe<CurrentVersion>;
  onCreateDomain?: Maybe<Domain>;
  onCreateDomainMetadata?: Maybe<DomainMetadata>;
  onCreateExpenditure?: Maybe<Expenditure>;
  onCreateExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  onCreateExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  onCreateIngestorStats?: Maybe<IngestorStats>;
  onCreateLiquidationAddress?: Maybe<LiquidationAddress>;
  onCreateMotionMessage?: Maybe<MotionMessage>;
  onCreateMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  onCreateNotificationsData?: Maybe<NotificationsData>;
  onCreatePrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  onCreateProfile?: Maybe<Profile>;
  onCreateProxyColony?: Maybe<ProxyColony>;
  onCreateReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  onCreateSafeTransaction?: Maybe<SafeTransaction>;
  onCreateSafeTransactionData?: Maybe<SafeTransactionData>;
  onCreateStreamingPayment?: Maybe<StreamingPayment>;
  onCreateStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  onCreateToken?: Maybe<Token>;
  onCreateTokenExchangeRate?: Maybe<TokenExchangeRate>;
  onCreateTransaction?: Maybe<Transaction>;
  onCreateUser?: Maybe<User>;
  onCreateUserStake?: Maybe<UserStake>;
  onCreateUserTokens?: Maybe<UserTokens>;
  onCreateVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
  onDeleteAnnotation?: Maybe<Annotation>;
  onDeleteCacheTotalBalance?: Maybe<CacheTotalBalance>;
  onDeleteColony?: Maybe<Colony>;
  onDeleteColonyAction?: Maybe<ColonyAction>;
  onDeleteColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  onDeleteColonyContributor?: Maybe<ColonyContributor>;
  onDeleteColonyDecision?: Maybe<ColonyDecision>;
  onDeleteColonyExtension?: Maybe<ColonyExtension>;
  onDeleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onDeleteColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onDeleteColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  onDeleteColonyMetadata?: Maybe<ColonyMetadata>;
  onDeleteColonyMotion?: Maybe<ColonyMotion>;
  onDeleteColonyMultiSig?: Maybe<ColonyMultiSig>;
  onDeleteColonyRole?: Maybe<ColonyRole>;
  onDeleteColonyTokens?: Maybe<ColonyTokens>;
  onDeleteContractEvent?: Maybe<ContractEvent>;
  onDeleteContributorReputation?: Maybe<ContributorReputation>;
  onDeleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onDeleteCurrentVersion?: Maybe<CurrentVersion>;
  onDeleteDomain?: Maybe<Domain>;
  onDeleteDomainMetadata?: Maybe<DomainMetadata>;
  onDeleteExpenditure?: Maybe<Expenditure>;
  onDeleteExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  onDeleteExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  onDeleteIngestorStats?: Maybe<IngestorStats>;
  onDeleteLiquidationAddress?: Maybe<LiquidationAddress>;
  onDeleteMotionMessage?: Maybe<MotionMessage>;
  onDeleteMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  onDeleteNotificationsData?: Maybe<NotificationsData>;
  onDeletePrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  onDeleteProfile?: Maybe<Profile>;
  onDeleteProxyColony?: Maybe<ProxyColony>;
  onDeleteReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  onDeleteSafeTransaction?: Maybe<SafeTransaction>;
  onDeleteSafeTransactionData?: Maybe<SafeTransactionData>;
  onDeleteStreamingPayment?: Maybe<StreamingPayment>;
  onDeleteStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  onDeleteToken?: Maybe<Token>;
  onDeleteTokenExchangeRate?: Maybe<TokenExchangeRate>;
  onDeleteTransaction?: Maybe<Transaction>;
  onDeleteUser?: Maybe<User>;
  onDeleteUserStake?: Maybe<UserStake>;
  onDeleteUserTokens?: Maybe<UserTokens>;
  onDeleteVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
  onUpdateAnnotation?: Maybe<Annotation>;
  onUpdateCacheTotalBalance?: Maybe<CacheTotalBalance>;
  onUpdateColony?: Maybe<Colony>;
  onUpdateColonyAction?: Maybe<ColonyAction>;
  onUpdateColonyActionMetadata?: Maybe<ColonyActionMetadata>;
  onUpdateColonyContributor?: Maybe<ColonyContributor>;
  onUpdateColonyDecision?: Maybe<ColonyDecision>;
  onUpdateColonyExtension?: Maybe<ColonyExtension>;
  onUpdateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onUpdateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onUpdateColonyMemberInvite?: Maybe<ColonyMemberInvite>;
  onUpdateColonyMetadata?: Maybe<ColonyMetadata>;
  onUpdateColonyMotion?: Maybe<ColonyMotion>;
  onUpdateColonyMultiSig?: Maybe<ColonyMultiSig>;
  onUpdateColonyRole?: Maybe<ColonyRole>;
  onUpdateColonyTokens?: Maybe<ColonyTokens>;
  onUpdateContractEvent?: Maybe<ContractEvent>;
  onUpdateContributorReputation?: Maybe<ContributorReputation>;
  onUpdateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onUpdateCurrentVersion?: Maybe<CurrentVersion>;
  onUpdateDomain?: Maybe<Domain>;
  onUpdateDomainMetadata?: Maybe<DomainMetadata>;
  onUpdateExpenditure?: Maybe<Expenditure>;
  onUpdateExpenditureMetadata?: Maybe<ExpenditureMetadata>;
  onUpdateExtensionInstallationsCount?: Maybe<ExtensionInstallationsCount>;
  onUpdateIngestorStats?: Maybe<IngestorStats>;
  onUpdateLiquidationAddress?: Maybe<LiquidationAddress>;
  onUpdateMotionMessage?: Maybe<MotionMessage>;
  onUpdateMultiSigUserSignature?: Maybe<MultiSigUserSignature>;
  onUpdateNotificationsData?: Maybe<NotificationsData>;
  onUpdatePrivateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  onUpdateProfile?: Maybe<Profile>;
  onUpdateProxyColony?: Maybe<ProxyColony>;
  onUpdateReputationMiningCycleMetadata?: Maybe<ReputationMiningCycleMetadata>;
  onUpdateSafeTransaction?: Maybe<SafeTransaction>;
  onUpdateSafeTransactionData?: Maybe<SafeTransactionData>;
  onUpdateStreamingPayment?: Maybe<StreamingPayment>;
  onUpdateStreamingPaymentMetadata?: Maybe<StreamingPaymentMetadata>;
  onUpdateToken?: Maybe<Token>;
  onUpdateTokenExchangeRate?: Maybe<TokenExchangeRate>;
  onUpdateTransaction?: Maybe<Transaction>;
  onUpdateUser?: Maybe<User>;
  onUpdateUserStake?: Maybe<UserStake>;
  onUpdateUserTokens?: Maybe<UserTokens>;
  onUpdateVoterRewardsHistory?: Maybe<VoterRewardsHistory>;
};

export type SubscriptionOnCreateAnnotationArgs = {
  filter?: InputMaybe<ModelSubscriptionAnnotationFilterInput>;
};

export type SubscriptionOnCreateCacheTotalBalanceArgs = {
  filter?: InputMaybe<ModelSubscriptionCacheTotalBalanceFilterInput>;
};

export type SubscriptionOnCreateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};

export type SubscriptionOnCreateColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
};

export type SubscriptionOnCreateColonyActionMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionMetadataFilterInput>;
};

export type SubscriptionOnCreateColonyContributorArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyContributorFilterInput>;
};

export type SubscriptionOnCreateColonyDecisionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyDecisionFilterInput>;
};

export type SubscriptionOnCreateColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};

export type SubscriptionOnCreateColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};

export type SubscriptionOnCreateColonyHistoricRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>;
};

export type SubscriptionOnCreateColonyMemberInviteArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMemberInviteFilterInput>;
};

export type SubscriptionOnCreateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};

export type SubscriptionOnCreateColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};

export type SubscriptionOnCreateColonyMultiSigArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMultiSigFilterInput>;
};

export type SubscriptionOnCreateColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};

export type SubscriptionOnCreateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};

export type SubscriptionOnCreateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};

export type SubscriptionOnCreateContributorReputationArgs = {
  filter?: InputMaybe<ModelSubscriptionContributorReputationFilterInput>;
};

export type SubscriptionOnCreateCurrentNetworkInverseFeeArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>;
};

export type SubscriptionOnCreateCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};

export type SubscriptionOnCreateDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
};

export type SubscriptionOnCreateDomainMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainMetadataFilterInput>;
};

export type SubscriptionOnCreateExpenditureArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureFilterInput>;
};

export type SubscriptionOnCreateExpenditureMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureMetadataFilterInput>;
};

export type SubscriptionOnCreateExtensionInstallationsCountArgs = {
  filter?: InputMaybe<ModelSubscriptionExtensionInstallationsCountFilterInput>;
};

export type SubscriptionOnCreateIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
};

export type SubscriptionOnCreateLiquidationAddressArgs = {
  filter?: InputMaybe<ModelSubscriptionLiquidationAddressFilterInput>;
};

export type SubscriptionOnCreateMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};

export type SubscriptionOnCreateMultiSigUserSignatureArgs = {
  filter?: InputMaybe<ModelSubscriptionMultiSigUserSignatureFilterInput>;
};

export type SubscriptionOnCreateNotificationsDataArgs = {
  filter?: InputMaybe<ModelSubscriptionNotificationsDataFilterInput>;
};

export type SubscriptionOnCreatePrivateBetaInviteCodeArgs = {
  filter?: InputMaybe<ModelSubscriptionPrivateBetaInviteCodeFilterInput>;
};

export type SubscriptionOnCreateProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};

export type SubscriptionOnCreateProxyColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionProxyColonyFilterInput>;
};

export type SubscriptionOnCreateReputationMiningCycleMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionReputationMiningCycleMetadataFilterInput>;
};

export type SubscriptionOnCreateSafeTransactionArgs = {
  filter?: InputMaybe<ModelSubscriptionSafeTransactionFilterInput>;
};

export type SubscriptionOnCreateSafeTransactionDataArgs = {
  filter?: InputMaybe<ModelSubscriptionSafeTransactionDataFilterInput>;
};

export type SubscriptionOnCreateStreamingPaymentArgs = {
  filter?: InputMaybe<ModelSubscriptionStreamingPaymentFilterInput>;
};

export type SubscriptionOnCreateStreamingPaymentMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionStreamingPaymentMetadataFilterInput>;
};

export type SubscriptionOnCreateTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};

export type SubscriptionOnCreateTokenExchangeRateArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenExchangeRateFilterInput>;
};

export type SubscriptionOnCreateTransactionArgs = {
  filter?: InputMaybe<ModelSubscriptionTransactionFilterInput>;
};

export type SubscriptionOnCreateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};

export type SubscriptionOnCreateUserStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionUserStakeFilterInput>;
};

export type SubscriptionOnCreateUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};

export type SubscriptionOnCreateVoterRewardsHistoryArgs = {
  filter?: InputMaybe<ModelSubscriptionVoterRewardsHistoryFilterInput>;
};

export type SubscriptionOnDeleteAnnotationArgs = {
  filter?: InputMaybe<ModelSubscriptionAnnotationFilterInput>;
};

export type SubscriptionOnDeleteCacheTotalBalanceArgs = {
  filter?: InputMaybe<ModelSubscriptionCacheTotalBalanceFilterInput>;
};

export type SubscriptionOnDeleteColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};

export type SubscriptionOnDeleteColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
};

export type SubscriptionOnDeleteColonyActionMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionMetadataFilterInput>;
};

export type SubscriptionOnDeleteColonyContributorArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyContributorFilterInput>;
};

export type SubscriptionOnDeleteColonyDecisionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyDecisionFilterInput>;
};

export type SubscriptionOnDeleteColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};

export type SubscriptionOnDeleteColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};

export type SubscriptionOnDeleteColonyHistoricRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>;
};

export type SubscriptionOnDeleteColonyMemberInviteArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMemberInviteFilterInput>;
};

export type SubscriptionOnDeleteColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};

export type SubscriptionOnDeleteColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};

export type SubscriptionOnDeleteColonyMultiSigArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMultiSigFilterInput>;
};

export type SubscriptionOnDeleteColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};

export type SubscriptionOnDeleteColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};

export type SubscriptionOnDeleteContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};

export type SubscriptionOnDeleteContributorReputationArgs = {
  filter?: InputMaybe<ModelSubscriptionContributorReputationFilterInput>;
};

export type SubscriptionOnDeleteCurrentNetworkInverseFeeArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>;
};

export type SubscriptionOnDeleteCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};

export type SubscriptionOnDeleteDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
};

export type SubscriptionOnDeleteDomainMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainMetadataFilterInput>;
};

export type SubscriptionOnDeleteExpenditureArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureFilterInput>;
};

export type SubscriptionOnDeleteExpenditureMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureMetadataFilterInput>;
};

export type SubscriptionOnDeleteExtensionInstallationsCountArgs = {
  filter?: InputMaybe<ModelSubscriptionExtensionInstallationsCountFilterInput>;
};

export type SubscriptionOnDeleteIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
};

export type SubscriptionOnDeleteLiquidationAddressArgs = {
  filter?: InputMaybe<ModelSubscriptionLiquidationAddressFilterInput>;
};

export type SubscriptionOnDeleteMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};

export type SubscriptionOnDeleteMultiSigUserSignatureArgs = {
  filter?: InputMaybe<ModelSubscriptionMultiSigUserSignatureFilterInput>;
};

export type SubscriptionOnDeleteNotificationsDataArgs = {
  filter?: InputMaybe<ModelSubscriptionNotificationsDataFilterInput>;
};

export type SubscriptionOnDeletePrivateBetaInviteCodeArgs = {
  filter?: InputMaybe<ModelSubscriptionPrivateBetaInviteCodeFilterInput>;
};

export type SubscriptionOnDeleteProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};

export type SubscriptionOnDeleteProxyColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionProxyColonyFilterInput>;
};

export type SubscriptionOnDeleteReputationMiningCycleMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionReputationMiningCycleMetadataFilterInput>;
};

export type SubscriptionOnDeleteSafeTransactionArgs = {
  filter?: InputMaybe<ModelSubscriptionSafeTransactionFilterInput>;
};

export type SubscriptionOnDeleteSafeTransactionDataArgs = {
  filter?: InputMaybe<ModelSubscriptionSafeTransactionDataFilterInput>;
};

export type SubscriptionOnDeleteStreamingPaymentArgs = {
  filter?: InputMaybe<ModelSubscriptionStreamingPaymentFilterInput>;
};

export type SubscriptionOnDeleteStreamingPaymentMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionStreamingPaymentMetadataFilterInput>;
};

export type SubscriptionOnDeleteTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};

export type SubscriptionOnDeleteTokenExchangeRateArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenExchangeRateFilterInput>;
};

export type SubscriptionOnDeleteTransactionArgs = {
  filter?: InputMaybe<ModelSubscriptionTransactionFilterInput>;
};

export type SubscriptionOnDeleteUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};

export type SubscriptionOnDeleteUserStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionUserStakeFilterInput>;
};

export type SubscriptionOnDeleteUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};

export type SubscriptionOnDeleteVoterRewardsHistoryArgs = {
  filter?: InputMaybe<ModelSubscriptionVoterRewardsHistoryFilterInput>;
};

export type SubscriptionOnUpdateAnnotationArgs = {
  filter?: InputMaybe<ModelSubscriptionAnnotationFilterInput>;
};

export type SubscriptionOnUpdateCacheTotalBalanceArgs = {
  filter?: InputMaybe<ModelSubscriptionCacheTotalBalanceFilterInput>;
};

export type SubscriptionOnUpdateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};

export type SubscriptionOnUpdateColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
};

export type SubscriptionOnUpdateColonyActionMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionMetadataFilterInput>;
};

export type SubscriptionOnUpdateColonyContributorArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyContributorFilterInput>;
};

export type SubscriptionOnUpdateColonyDecisionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyDecisionFilterInput>;
};

export type SubscriptionOnUpdateColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};

export type SubscriptionOnUpdateColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};

export type SubscriptionOnUpdateColonyHistoricRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>;
};

export type SubscriptionOnUpdateColonyMemberInviteArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMemberInviteFilterInput>;
};

export type SubscriptionOnUpdateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};

export type SubscriptionOnUpdateColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};

export type SubscriptionOnUpdateColonyMultiSigArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMultiSigFilterInput>;
};

export type SubscriptionOnUpdateColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};

export type SubscriptionOnUpdateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};

export type SubscriptionOnUpdateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};

export type SubscriptionOnUpdateContributorReputationArgs = {
  filter?: InputMaybe<ModelSubscriptionContributorReputationFilterInput>;
};

export type SubscriptionOnUpdateCurrentNetworkInverseFeeArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>;
};

export type SubscriptionOnUpdateCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};

export type SubscriptionOnUpdateDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
};

export type SubscriptionOnUpdateDomainMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainMetadataFilterInput>;
};

export type SubscriptionOnUpdateExpenditureArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureFilterInput>;
};

export type SubscriptionOnUpdateExpenditureMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureMetadataFilterInput>;
};

export type SubscriptionOnUpdateExtensionInstallationsCountArgs = {
  filter?: InputMaybe<ModelSubscriptionExtensionInstallationsCountFilterInput>;
};

export type SubscriptionOnUpdateIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
};

export type SubscriptionOnUpdateLiquidationAddressArgs = {
  filter?: InputMaybe<ModelSubscriptionLiquidationAddressFilterInput>;
};

export type SubscriptionOnUpdateMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};

export type SubscriptionOnUpdateMultiSigUserSignatureArgs = {
  filter?: InputMaybe<ModelSubscriptionMultiSigUserSignatureFilterInput>;
};

export type SubscriptionOnUpdateNotificationsDataArgs = {
  filter?: InputMaybe<ModelSubscriptionNotificationsDataFilterInput>;
};

export type SubscriptionOnUpdatePrivateBetaInviteCodeArgs = {
  filter?: InputMaybe<ModelSubscriptionPrivateBetaInviteCodeFilterInput>;
};

export type SubscriptionOnUpdateProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};

export type SubscriptionOnUpdateProxyColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionProxyColonyFilterInput>;
};

export type SubscriptionOnUpdateReputationMiningCycleMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionReputationMiningCycleMetadataFilterInput>;
};

export type SubscriptionOnUpdateSafeTransactionArgs = {
  filter?: InputMaybe<ModelSubscriptionSafeTransactionFilterInput>;
};

export type SubscriptionOnUpdateSafeTransactionDataArgs = {
  filter?: InputMaybe<ModelSubscriptionSafeTransactionDataFilterInput>;
};

export type SubscriptionOnUpdateStreamingPaymentArgs = {
  filter?: InputMaybe<ModelSubscriptionStreamingPaymentFilterInput>;
};

export type SubscriptionOnUpdateStreamingPaymentMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionStreamingPaymentMetadataFilterInput>;
};

export type SubscriptionOnUpdateTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};

export type SubscriptionOnUpdateTokenExchangeRateArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenExchangeRateFilterInput>;
};

export type SubscriptionOnUpdateTransactionArgs = {
  filter?: InputMaybe<ModelSubscriptionTransactionFilterInput>;
};

export type SubscriptionOnUpdateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};

export type SubscriptionOnUpdateUserStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionUserStakeFilterInput>;
};

export type SubscriptionOnUpdateUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};

export type SubscriptionOnUpdateVoterRewardsHistoryArgs = {
  filter?: InputMaybe<ModelSubscriptionVoterRewardsHistoryFilterInput>;
};

/** Represents the currencies/tokens that users' balances can be converted to (for display purposes) */
export enum SupportedCurrencies {
  Brl = 'BRL',
  Cad = 'CAD',
  Clny = 'CLNY',
  Eth = 'ETH',
  Eur = 'EUR',
  Gbp = 'GBP',
  Inr = 'INR',
  Jpy = 'JPY',
  Krw = 'KRW',
  Usd = 'USD',
}

/** Return type for domain balance for a timeframe item */
export type TimeframeDomainBalanceInOut = {
  __typename?: 'TimeframeDomainBalanceInOut';
  /** The timeframe item key representing a day/week/month based on the selected timeframeType */
  key: Scalars['String'];
  /** The timeframe item value holding the computed values */
  value?: Maybe<DomainBalanceInOut>;
};

/** Variants of different timeframe periods we can request balance for */
export enum TimeframeType {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Total = 'TOTAL',
  Weekly = 'WEEKLY',
}

/** Represents an ERC20-compatible token that is used by Colonies and users */
export type Token = {
  __typename?: 'Token';
  /** URL of the token's avatar image (logo) */
  avatar?: Maybe<Scalars['String']>;
  /** Metadata related to the chain of the token */
  chainMetadata: ChainMetadata;
  colonies?: Maybe<ModelColonyTokensConnection>;
  /** Timestamp of the token model's creation in the database */
  createdAt: Scalars['AWSDateTime'];
  /** Decimal precision of the token */
  decimals: Scalars['Int'];
  /** Unique identifier for the token (contract address) */
  id: Scalars['ID'];
  /** Name of the token */
  name: Scalars['String'];
  /** Symbol of the token */
  symbol: Scalars['String'];
  /** URL of the token's thumbnail image (Small logo) */
  thumbnail?: Maybe<Scalars['String']>;
  /** Type of the token. See `TokenType` for more information */
  type?: Maybe<TokenType>;
  updatedAt: Scalars['AWSDateTime'];
  users?: Maybe<ModelUserTokensConnection>;
  /** If the token was validated by the Colony Team, meaning it shows up in the manage tokens list to add to your colony */
  validated?: Maybe<Scalars['Boolean']>;
};

/** Represents an ERC20-compatible token that is used by Colonies and users */
export type TokenColoniesArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents an ERC20-compatible token that is used by Colonies and users */
export type TokenUsersArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a table with token exchange rates */
export type TokenExchangeRate = {
  __typename?: 'TokenExchangeRate';
  createdAt: Scalars['AWSDateTime'];
  /** Exchange timestamp */
  date: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  /** Exchange currency */
  marketPrice: Array<Maybe<MarketPrice>>;
  /** Unique identifier for the token id */
  tokenId: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Input data for fetching a token's information from DB or chain */
export type TokenFromEverywhereArguments = {
  /** The URL of the token image */
  avatar?: InputMaybe<Scalars['String']>;
  network?: InputMaybe<Scalars['String']>;
  /** The URL of the token thumbnail image */
  thumbnail?: InputMaybe<Scalars['String']>;
  /** Address of the token on the blockchain */
  tokenAddress: Scalars['String'];
};

/** Return type for tokens gotten from DB or from chain */
export type TokenFromEverywhereReturn = {
  __typename?: 'TokenFromEverywhereReturn';
  /** List of tokens found */
  items?: Maybe<Array<Maybe<Token>>>;
};

/** Input type for specifying a Token */
export type TokenInput = {
  /** Unique identifier for the Token */
  id: Scalars['ID'];
};

/**
 * Variants of different token types a Colony can use
 * As Colonies can use multiple tokens and even own tokens (BYOT), we need to differentiate
 */
export enum TokenType {
  /** The native token of the Chain used (e.g. ETH on mainnet or xDAI on Gnosis-Chain) */
  ChainNative = 'CHAIN_NATIVE',
  /** A (ERC20-compatible) token that was deployed with Colony. It has a few more features, like minting through the Colony itself */
  Colony = 'COLONY',
  /** An ERC20-compatible token */
  Erc20 = 'ERC20',
}

/** Represents a transaction made in a colony by a user */
export type Transaction = {
  __typename?: 'Transaction';
  /** The block hash of the transaction */
  blockHash?: Maybe<Scalars['String']>;
  /** The block number of the transaction */
  blockNumber?: Maybe<Scalars['Int']>;
  /** The colony the transaction was made in */
  colonyAddress: Scalars['ID'];
  /** The contract the transaction was made on */
  context: ClientType;
  /** Time the transaction was created */
  createdAt: Scalars['AWSDateTime'];
  /** Is the transaction cancelled? */
  deleted?: Maybe<Scalars['Boolean']>;
  /** A contract address associated with a successful transaction */
  deployedContractAddress?: Maybe<Scalars['String']>;
  /** The error associated with the transaction, if any */
  error?: Maybe<TransactionError>;
  /** Event data associated with a successful transaction */
  eventData?: Maybe<Scalars['String']>;
  /** The sender of the transaction */
  from: Scalars['ID'];
  /** The transaction's gas limit */
  gasLimit?: Maybe<Scalars['String']>;
  /** The transaction's gas price */
  gasPrice?: Maybe<Scalars['String']>;
  /** The group to which the transaction belongs */
  group: TransactionGroup;
  /** The id of the group to which the transaction belongs */
  groupId: Scalars['ID'];
  /** The transaction hash */
  hash?: Maybe<Scalars['String']>;
  /** Transaction id */
  id: Scalars['ID'];
  /** An identifier for the transaction */
  identifier?: Maybe<Scalars['String']>;
  /** True if a related transaction is loading */
  loadingRelated?: Maybe<Scalars['Boolean']>;
  /** Context in which method is used e.g. setOneTxRole */
  methodContext?: Maybe<Scalars['String']>;
  /** The name of the contract method used */
  methodName: Scalars['String'];
  /** Options associated with the transaction */
  options?: Maybe<Scalars['String']>;
  /** The params the transaction was called with */
  params?: Maybe<Scalars['String']>;
  /** Transaction receipt */
  receipt?: Maybe<Scalars['String']>;
  /** The current status of the transaction */
  status: TransactionStatus;
  /** A title to show in the UI */
  title?: Maybe<Scalars['String']>;
  /** Title values for FormatJS interpolation */
  titleValues?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
};

export type TransactionError = {
  __typename?: 'TransactionError';
  message: Scalars['String'];
  type: TransactionErrors;
};

export type TransactionErrorInput = {
  message: Scalars['String'];
  type: TransactionErrors;
};

export enum TransactionErrors {
  Estimate = 'ESTIMATE',
  EventData = 'EVENT_DATA',
  Receipt = 'RECEIPT',
  Send = 'SEND',
  Unsuccessful = 'UNSUCCESSFUL',
}

export type TransactionGroup = {
  __typename?: 'TransactionGroup';
  description?: Maybe<Scalars['String']>;
  descriptionValues?: Maybe<Scalars['String']>;
  groupId: Scalars['String'];
  id: Scalars['String'];
  index: Scalars['Int'];
  key: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  titleValues?: Maybe<Scalars['String']>;
};

export type TransactionGroupInput = {
  description?: InputMaybe<Scalars['String']>;
  descriptionValues?: InputMaybe<Scalars['String']>;
  groupId: Scalars['String'];
  id: Scalars['String'];
  index: Scalars['Int'];
  key: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
  titleValues?: InputMaybe<Scalars['String']>;
};

export enum TransactionStatus {
  Created = 'CREATED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Ready = 'READY',
  Succeeded = 'SUCCEEDED',
}

export type UpdateAnnotationInput = {
  actionId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  ipfsHash?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
};

export type UpdateCacheTotalBalanceInput = {
  colonyAddress?: InputMaybe<Scalars['ID']>;
  date?: InputMaybe<Scalars['AWSDateTime']>;
  domainId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  timeframePeriod?: InputMaybe<Scalars['Int']>;
  timeframeType?: InputMaybe<TimeframeType>;
  totalUSDC?: InputMaybe<Scalars['String']>;
  totalUSDCIn?: InputMaybe<Scalars['String']>;
  totalUSDCOut?: InputMaybe<Scalars['String']>;
};

export type UpdateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  annotationId?: InputMaybe<Scalars['ID']>;
  approvedTokenChanges?: InputMaybe<ApprovedTokenChangesInput>;
  arbitraryTransactions?: InputMaybe<
    Array<ColonyActionArbitraryTransactionInput>
  >;
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyDecisionId?: InputMaybe<Scalars['ID']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  expenditureId?: InputMaybe<Scalars['ID']>;
  expenditureSlotChanges?: InputMaybe<ExpenditureSlotChangesInput>;
  expenditureSlotIds?: InputMaybe<Array<Scalars['Int']>>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fromPotId?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  individualEvents?: InputMaybe<Scalars['String']>;
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  isMotion?: InputMaybe<Scalars['Boolean']>;
  isMotionFinalization?: InputMaybe<Scalars['Boolean']>;
  isMultiSig?: InputMaybe<Scalars['Boolean']>;
  members?: InputMaybe<Array<Scalars['ID']>>;
  motionDomainId?: InputMaybe<Scalars['Int']>;
  motionId?: InputMaybe<Scalars['ID']>;
  multiSigId?: InputMaybe<Scalars['ID']>;
  networkFee?: InputMaybe<Scalars['String']>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  paymentId?: InputMaybe<Scalars['Int']>;
  payments?: InputMaybe<Array<PaymentInput>>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  roles?: InputMaybe<ColonyActionRolesInput>;
  rolesAreMultiSig?: InputMaybe<Scalars['Boolean']>;
  rootHash?: InputMaybe<Scalars['String']>;
  showInActionsList?: InputMaybe<Scalars['Boolean']>;
  toDomainId?: InputMaybe<Scalars['ID']>;
  toPotId?: InputMaybe<Scalars['Int']>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<ColonyActionType>;
};

export type UpdateColonyActionMetadataInput = {
  arbitraryTxAbis?: InputMaybe<Array<ArbitraryTxAbiInput>>;
  customTitle?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type UpdateColonyContributorInput = {
  colonyAddress?: InputMaybe<Scalars['ID']>;
  colonyReputationPercentage?: InputMaybe<Scalars['Float']>;
  contributorAddress?: InputMaybe<Scalars['ID']>;
  hasPermissions?: InputMaybe<Scalars['Boolean']>;
  hasReputation?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isVerified?: InputMaybe<Scalars['Boolean']>;
  isWatching?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<ContributorType>;
};

export type UpdateColonyDecisionInput = {
  actionId?: InputMaybe<Scalars['ID']>;
  colonyAddress?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  motionDomainId?: InputMaybe<Scalars['Int']>;
  showInDecisionsList?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  walletAddress?: InputMaybe<Scalars['String']>;
};

export type UpdateColonyExtensionInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  hash?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  installedBy?: InputMaybe<Scalars['String']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  params?: InputMaybe<ExtensionParamsInput>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyFundsClaimInput = {
  amount?: InputMaybe<Scalars['String']>;
  colonyFundsClaimTokenId?: InputMaybe<Scalars['ID']>;
  colonyFundsClaimsId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  isClaimed?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateColonyHistoricRoleInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  isMultiSig?: InputMaybe<Scalars['Boolean']>;
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};

export type UpdateColonyInput = {
  balances?: InputMaybe<ColonyBalancesInput>;
  chainFundsClaim?: InputMaybe<ColonyChainFundsClaimInput>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  colonyMemberInviteCode?: InputMaybe<Scalars['ID']>;
  createdAtBlock?: InputMaybe<Scalars['Int']>;
  expendituresGlobalClaimDelay?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastUpdatedContributorsWithReputation?: InputMaybe<Scalars['AWSDateTime']>;
  motionsWithUnclaimedStakes?: InputMaybe<Array<ColonyUnclaimedStakeInput>>;
  name?: InputMaybe<Scalars['String']>;
  nativeTokenId?: InputMaybe<Scalars['ID']>;
  private?: InputMaybe<Scalars['Boolean']>;
  reputation?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyMemberInviteInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  invitesRemaining?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyMetadataInput = {
  avatar?: InputMaybe<Scalars['String']>;
  changelog?: InputMaybe<Array<ColonyMetadataChangelogInput>>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  etherealData?: InputMaybe<ColonyMetadataEtherealDataInput>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  id: Scalars['ID'];
  objective?: InputMaybe<ColonyObjectiveInput>;
  safes?: InputMaybe<Array<SafeInput>>;
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type UpdateColonyMotionInput = {
  createdBy?: InputMaybe<Scalars['String']>;
  editedExpenditureSlots?: InputMaybe<Array<ExpenditureSlotInput>>;
  expenditureFunding?: InputMaybe<Array<ExpenditureFundingItemInput>>;
  expenditureId?: InputMaybe<Scalars['ID']>;
  expenditureSlotIds?: InputMaybe<Array<Scalars['Int']>>;
  hasObjection?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isDecision?: InputMaybe<Scalars['Boolean']>;
  isFinalized?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['ID']>;
  motionStakes?: InputMaybe<MotionStakesInput>;
  motionStateHistory?: InputMaybe<MotionStateHistoryInput>;
  nativeMotionDomainId?: InputMaybe<Scalars['String']>;
  nativeMotionId?: InputMaybe<Scalars['String']>;
  objectionAnnotationId?: InputMaybe<Scalars['ID']>;
  remainingStakes?: InputMaybe<Array<Scalars['String']>>;
  repSubmitted?: InputMaybe<Scalars['String']>;
  requiredStake?: InputMaybe<Scalars['String']>;
  revealedVotes?: InputMaybe<MotionStakesInput>;
  skillRep?: InputMaybe<Scalars['String']>;
  stakerRewards?: InputMaybe<Array<StakerRewardsInput>>;
  transactionHash?: InputMaybe<Scalars['ID']>;
  userMinStake?: InputMaybe<Scalars['String']>;
  usersStakes?: InputMaybe<Array<UserMotionStakesInput>>;
  voterRecord?: InputMaybe<Array<VoterRecordInput>>;
};

export type UpdateColonyMultiSigInput = {
  colonyAddress?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  executedAt?: InputMaybe<Scalars['AWSDateTime']>;
  executedBy?: InputMaybe<Scalars['ID']>;
  expenditureFunding?: InputMaybe<Array<ExpenditureFundingItemInput>>;
  expenditureId?: InputMaybe<Scalars['ID']>;
  hasActionCompleted?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isDecision?: InputMaybe<Scalars['Boolean']>;
  isExecuted?: InputMaybe<Scalars['Boolean']>;
  isRejected?: InputMaybe<Scalars['Boolean']>;
  multiSigDomainId?: InputMaybe<Scalars['ID']>;
  nativeMultiSigDomainId?: InputMaybe<Scalars['String']>;
  nativeMultiSigId?: InputMaybe<Scalars['ID']>;
  rejectedAt?: InputMaybe<Scalars['AWSDateTime']>;
  rejectedBy?: InputMaybe<Scalars['ID']>;
  requiredPermissions?: InputMaybe<Scalars['Int']>;
  transactionHash?: InputMaybe<Scalars['ID']>;
};

export type UpdateColonyRoleInput = {
  colonyAddress?: InputMaybe<Scalars['ID']>;
  colonyRolesId?: InputMaybe<Scalars['ID']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  isMultiSig?: InputMaybe<Scalars['Boolean']>;
  latestBlock?: InputMaybe<Scalars['Int']>;
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
};

export type UpdateColonyTokensInput = {
  colonyID?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  tokenID?: InputMaybe<Scalars['ID']>;
};

export type UpdateContractEventInput = {
  agent?: InputMaybe<Scalars['String']>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  contractEventColonyId?: InputMaybe<Scalars['ID']>;
  contractEventDomainId?: InputMaybe<Scalars['ID']>;
  contractEventTokenId?: InputMaybe<Scalars['ID']>;
  contractEventUserId?: InputMaybe<Scalars['ID']>;
  encodedArguments?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<Scalars['String']>;
  target?: InputMaybe<Scalars['String']>;
};

export type UpdateContributorReputationInput = {
  colonyAddress?: InputMaybe<Scalars['ID']>;
  contributorAddress?: InputMaybe<Scalars['ID']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  reputationPercentage?: InputMaybe<Scalars['Float']>;
  reputationRaw?: InputMaybe<Scalars['String']>;
};

export type UpdateContributorsWithReputationInput = {
  /** The colony address */
  colonyAddress?: InputMaybe<Scalars['String']>;
};

export type UpdateCurrentNetworkInverseFeeInput = {
  id: Scalars['ID'];
  inverseFee?: InputMaybe<Scalars['String']>;
};

export type UpdateCurrentVersionInput = {
  id: Scalars['ID'];
  key?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateDomainInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  isRoot?: InputMaybe<Scalars['Boolean']>;
  nativeFundingPotId?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<Scalars['Int']>;
  nativeSkillId?: InputMaybe<Scalars['String']>;
  reputation?: InputMaybe<Scalars['String']>;
  reputationPercentage?: InputMaybe<Scalars['String']>;
};

export type UpdateDomainMetadataInput = {
  changelog?: InputMaybe<Array<DomainMetadataChangelogInput>>;
  color?: InputMaybe<DomainColor>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateExpenditureInput = {
  balances?: InputMaybe<Array<ExpenditureBalanceInput>>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  finalizedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  firstEditTransactionHash?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isStaked?: InputMaybe<Scalars['Boolean']>;
  nativeDomainId?: InputMaybe<Scalars['Int']>;
  nativeFundingPotId?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<Scalars['Int']>;
  ownerAddress?: InputMaybe<Scalars['ID']>;
  slots?: InputMaybe<Array<ExpenditureSlotInput>>;
  splitPaymentPayoutClaimedNotificationSent?: InputMaybe<Scalars['Boolean']>;
  stagedExpenditureAddress?: InputMaybe<Scalars['ID']>;
  stakedExpenditureAddress?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<ExpenditureStatus>;
  type?: InputMaybe<ExpenditureType>;
  userStakeId?: InputMaybe<Scalars['ID']>;
};

export type UpdateExpenditureMetadataInput = {
  distributionType?: InputMaybe<SplitPaymentDistributionType>;
  expectedNumberOfPayouts?: InputMaybe<Scalars['Int']>;
  expectedNumberOfTokens?: InputMaybe<Scalars['Int']>;
  fundFromDomainNativeId?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  stages?: InputMaybe<Array<ExpenditureStageInput>>;
};

/**
 * Input data for updating an extension's information within a Colony, based on the Colony ID and extension hash
 * The hash is generated like so: `keccak256(toUtf8Bytes(extensionName))`, where `extensionName` is the name of the extension contract file in the Colony Network
 */
export type UpdateExtensionByColonyAndHashInput = {
  /** The unique identifier for the Colony */
  colonyId: Scalars['ID'];
  /** The hash of the extension to be updated */
  hash: Scalars['String'];
  /** The timestamp when the extension was installed */
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  /** The Ethereum address of the user who installed the extension */
  installedBy?: InputMaybe<Scalars['String']>;
  /** A flag to indicate whether the extension is deleted */
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  /** A flag to indicate whether the extension is deprecated */
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  /** A flag to indicate whether the extension is initialized */
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  /** The version of the extension */
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateExtensionInstallationsCountInput = {
  id: Scalars['ID'];
  multiSigPermissions?: InputMaybe<Scalars['Int']>;
  oneTxPayment?: InputMaybe<Scalars['Int']>;
  reputationWeighted?: InputMaybe<Scalars['Int']>;
  stagedExpenditure?: InputMaybe<Scalars['Int']>;
  stakedExpenditure?: InputMaybe<Scalars['Int']>;
  streamingPayments?: InputMaybe<Scalars['Int']>;
};

export type UpdateIngestorStatsInput = {
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['String']>;
};

export type UpdateLiquidationAddressInput = {
  chainId?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  liquidationAddress?: InputMaybe<Scalars['ID']>;
  userAddress?: InputMaybe<Scalars['ID']>;
};

export type UpdateMotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  messageKey?: InputMaybe<Scalars['String']>;
  motionId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  vote?: InputMaybe<Scalars['String']>;
};

export type UpdateMultiSigUserSignatureInput = {
  colonyAddress?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  multiSigId?: InputMaybe<Scalars['ID']>;
  role?: InputMaybe<Scalars['Int']>;
  userAddress?: InputMaybe<Scalars['ID']>;
  vote?: InputMaybe<MultiSigVote>;
};

export type UpdateNotificationsDataInput = {
  adminNotificationsDisabled?: InputMaybe<Scalars['Boolean']>;
  magicbellUserId?: InputMaybe<Scalars['ID']>;
  mentionNotificationsDisabled?: InputMaybe<Scalars['Boolean']>;
  mutedColonyAddresses?: InputMaybe<Array<Scalars['ID']>>;
  notificationsDisabled?: InputMaybe<Scalars['Boolean']>;
  paymentNotificationsDisabled?: InputMaybe<Scalars['Boolean']>;
  userAddress: Scalars['ID'];
};

export type UpdatePrivateBetaInviteCodeInput = {
  id: Scalars['ID'];
  shareableInvites?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type UpdateProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  displayNameChanged?: InputMaybe<Scalars['AWSDateTime']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  hasCompletedKYCFlow?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isAutoOfframpEnabled?: InputMaybe<Scalars['Boolean']>;
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  preferredCurrency?: InputMaybe<SupportedCurrencies>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type UpdateProxyColonyInput = {
  chainId?: InputMaybe<Scalars['String']>;
  colonyAddress?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  isActive?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateReputationMiningCycleMetadataInput = {
  id: Scalars['ID'];
  lastCompletedAt?: InputMaybe<Scalars['AWSDateTime']>;
};

export type UpdateSafeTransactionDataInput = {
  abi?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['String']>;
  contract?: InputMaybe<SimpleTargetInput>;
  contractFunction?: InputMaybe<Scalars['String']>;
  data?: InputMaybe<Scalars['String']>;
  functionParams?: InputMaybe<Array<InputMaybe<FunctionParamInput>>>;
  id: Scalars['ID'];
  nft?: InputMaybe<NftInput>;
  nftData?: InputMaybe<NftDataInput>;
  rawAmount?: InputMaybe<Scalars['String']>;
  recipient?: InputMaybe<SimpleTargetInput>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  transactionHash?: InputMaybe<Scalars['ID']>;
  transactionType?: InputMaybe<SafeTransactionType>;
};

export type UpdateSafeTransactionInput = {
  id: Scalars['ID'];
  safe?: InputMaybe<SafeInput>;
};

export type UpdateStreamingPaymentInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  endTime?: InputMaybe<Scalars['AWSTimestamp']>;
  id: Scalars['ID'];
  interval?: InputMaybe<Scalars['String']>;
  nativeDomainId?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<Scalars['Int']>;
  payouts?: InputMaybe<Array<ExpenditurePayoutInput>>;
  recipientAddress?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['AWSTimestamp']>;
};

export type UpdateStreamingPaymentMetadataInput = {
  endCondition?: InputMaybe<StreamingPaymentEndCondition>;
  id: Scalars['ID'];
  limitAmount?: InputMaybe<Scalars['String']>;
};

export type UpdateTokenExchangeRateInput = {
  date?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  marketPrice?: InputMaybe<Array<InputMaybe<MarketPriceInput>>>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export type UpdateTokenInput = {
  avatar?: InputMaybe<Scalars['String']>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TokenType>;
  validated?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateTransactionInput = {
  blockHash?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyAddress?: InputMaybe<Scalars['ID']>;
  context?: InputMaybe<ClientType>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  deleted?: InputMaybe<Scalars['Boolean']>;
  deployedContractAddress?: InputMaybe<Scalars['String']>;
  error?: InputMaybe<TransactionErrorInput>;
  eventData?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['ID']>;
  gasLimit?: InputMaybe<Scalars['String']>;
  gasPrice?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<TransactionGroupInput>;
  groupId?: InputMaybe<Scalars['ID']>;
  hash?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  identifier?: InputMaybe<Scalars['String']>;
  loadingRelated?: InputMaybe<Scalars['Boolean']>;
  methodContext?: InputMaybe<Scalars['String']>;
  methodName?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<Scalars['String']>;
  params?: InputMaybe<Scalars['String']>;
  receipt?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TransactionStatus>;
  title?: InputMaybe<Scalars['String']>;
  titleValues?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  bridgeCustomerId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  profileId?: InputMaybe<Scalars['ID']>;
  userPrivateBetaInviteCodeId?: InputMaybe<Scalars['ID']>;
};

export type UpdateUserStakeInput = {
  actionId?: InputMaybe<Scalars['ID']>;
  amount?: InputMaybe<Scalars['String']>;
  colonyAddress?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  isClaimed?: InputMaybe<Scalars['Boolean']>;
  isForfeited?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<UserStakeType>;
  userAddress?: InputMaybe<Scalars['ID']>;
};

export type UpdateUserTokensInput = {
  id: Scalars['ID'];
  tokenID?: InputMaybe<Scalars['ID']>;
  userID?: InputMaybe<Scalars['ID']>;
};

export type UpdateVoterRewardsHistoryInput = {
  amount?: InputMaybe<Scalars['String']>;
  colonyAddress?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  motionId?: InputMaybe<Scalars['ID']>;
  userAddress?: InputMaybe<Scalars['ID']>;
};

/** Represents a User within the Colony Network */
export type User = {
  __typename?: 'User';
  /** Bridge customer id */
  bridgeCustomerId?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the user (wallet address) */
  id: Scalars['ID'];
  liquidationAddresses?: Maybe<ModelLiquidationAddressConnection>;
  /** Notifications data for the user */
  notificationsData?: Maybe<NotificationsData>;
  /** A user who has been invited by colony will be able to pass on the private beta invite */
  privateBetaInviteCode?: Maybe<PrivateBetaInviteCode>;
  /** Profile information of the user */
  profile?: Maybe<Profile>;
  /** Profile ID associated with the user */
  profileId?: Maybe<Scalars['ID']>;
  roles?: Maybe<ModelColonyRoleConnection>;
  tokens?: Maybe<ModelUserTokensConnection>;
  transactionHistory?: Maybe<ModelTransactionConnection>;
  updatedAt: Scalars['AWSDateTime'];
  userPrivateBetaInviteCodeId?: Maybe<Scalars['ID']>;
};

/** Represents a User within the Colony Network */
export type UserLiquidationAddressesArgs = {
  filter?: InputMaybe<ModelLiquidationAddressFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a User within the Colony Network */
export type UserRolesArgs = {
  colonyAddress?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a User within the Colony Network */
export type UserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents a User within the Colony Network */
export type UserTransactionHistoryArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelTransactionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Stakes that a user has made for a motion */
export type UserMotionStakes = {
  __typename?: 'UserMotionStakes';
  /** The user's wallet address */
  address: Scalars['String'];
  /** Stake values */
  stakes: MotionStakes;
};

/** Input used to modify the stakes of a user for a motion */
export type UserMotionStakesInput = {
  /** The user's wallet address */
  address: Scalars['String'];
  /** Stake values */
  stakes: MotionStakesInput;
};

export type UserStake = {
  __typename?: 'UserStake';
  action?: Maybe<ColonyAction>;
  actionId: Scalars['ID'];
  amount: Scalars['String'];
  colonyAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** Self-managed, formatted as userAddress_transactionHash, where transactionHash is the hash of the transaction that is being staked for */
  id: Scalars['ID'];
  isClaimed: Scalars['Boolean'];
  /** Only applicable for expenditure stakes, indicates if the creator's stake was forfeited when expenditure was cancelled */
  isForfeited?: Maybe<Scalars['Boolean']>;
  type?: Maybe<UserStakeType>;
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userAddress: Scalars['ID'];
};

/** Type of stake a user can make */
export enum UserStakeType {
  Motion = 'MOTION',
  StakedExpenditure = 'STAKED_EXPENDITURE',
}

export type UserTokens = {
  __typename?: 'UserTokens';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  token: Token;
  tokenID: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userID: Scalars['ID'];
};

export type ValidateUserInviteInput = {
  /** The colony address */
  colonyAddress: Scalars['ID'];
  /** The invite code */
  inviteCode: Scalars['ID'];
  /** The user's wallet address */
  userAddress: Scalars['ID'];
};

/** A voter record of a user for a motion */
export type VoterRecord = {
  __typename?: 'VoterRecord';
  /** The user's wallet address */
  address: Scalars['String'];
  /**
   * The actual vote (yay or nay)
   * nullable since we don't know the vote until it's revealed
   */
  vote?: Maybe<Scalars['Int']>;
  /** The voting weight denominated by the user's reputation */
  voteCount: Scalars['String'];
};

/** Input used to modify a voter record of a user for a motion */
export type VoterRecordInput = {
  /** The user's wallet address */
  address: Scalars['String'];
  /**
   * The actual vote (yay or nay)
   * nullable since we don't know the vote until it's revealed
   */
  vote?: InputMaybe<Scalars['Int']>;
  /** The voting weight denominated by the user's reputation */
  voteCount: Scalars['String'];
};

/** Other motion voting rewards */
export type VoterRewardsHistory = {
  __typename?: 'VoterRewardsHistory';
  amount: Scalars['String'];
  colonyAddress: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  motionId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userAddress: Scalars['ID'];
};

/**
 * A return type that contains the voting reward for a user and a motion
 * `min` and `max` specify the potential reward range when the actual reward is unknown (before the _reveal_ phase)
 */
export type VoterRewardsReturn = {
  __typename?: 'VoterRewardsReturn';
  /**
   * The maximum possible reward amount
   * Only useful before the _reveal_ phase, when the actual amount is known
   */
  max: Scalars['String'];
  /**
   * The minimum possible reward amount
   * Only useful before the _reveal_ phase, when the actual amount is known
   */
  min: Scalars['String'];
  /** The actual reward amount */
  reward: Scalars['String'];
};

/**
 * Parameters that were set when installing the VotingReputation extension
 * For more info see [here](https://docs.colony.io/colonysdk/api/classes/VotingReputation#extension-parameters)
 */
export type VotingReputationParams = {
  __typename?: 'VotingReputationParams';
  /** Time that the escalation period will last (in seconds) */
  escalationPeriod: Scalars['String'];
  /** Percentage of the total reputation that voted should end the voting period */
  maxVoteFraction: Scalars['String'];
  /** Time that the reveal period will last (in seconds) */
  revealPeriod: Scalars['String'];
  /** Time that the staking period will last (in seconds) */
  stakePeriod: Scalars['String'];
  /** Time that the voting period will last (in seconds) */
  submitPeriod: Scalars['String'];
  /** Percentage of the team's reputation that needs to be staked ot activate either side of the motion */
  totalStakeFraction: Scalars['String'];
  /** Minimum percentage of the total stake that each user has to provide */
  userMinStakeFraction: Scalars['String'];
  /** Percentage of the losing side's stake that is awarded to the voters */
  voterRewardFraction: Scalars['String'];
};

export type VotingReputationParamsInput = {
  escalationPeriod: Scalars['String'];
  maxVoteFraction: Scalars['String'];
  revealPeriod: Scalars['String'];
  stakePeriod: Scalars['String'];
  submitPeriod: Scalars['String'];
  totalStakeFraction: Scalars['String'];
  userMinStakeFraction: Scalars['String'];
  voterRewardFraction: Scalars['String'];
};

export type ActionMetadataInfoFragment = {
  __typename?: 'ColonyAction';
  id: string;
  colonyDecisionId?: string | null;
  amount?: string | null;
  networkFee?: string | null;
  type: ColonyActionType;
  showInActionsList: boolean;
  colonyId: string;
  initiatorAddress: string;
  recipientAddress?: string | null;
  members?: Array<string> | null;
  pendingDomainMetadata?: {
    __typename?: 'DomainMetadata';
    name: string;
    color: DomainColor;
    description?: string | null;
    changelog?: Array<{
      __typename?: 'DomainMetadataChangelog';
      transactionHash: string;
      oldName: string;
      newName: string;
      oldColor: DomainColor;
      newColor: DomainColor;
      oldDescription?: string | null;
      newDescription?: string | null;
    }> | null;
  } | null;
  pendingColonyMetadata?: {
    __typename?: 'ColonyMetadata';
    id: string;
    displayName: string;
    avatar?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    externalLinks?: Array<{
      __typename?: 'ExternalLink';
      name: ExternalLinks;
      link: string;
    }> | null;
    objective?: {
      __typename?: 'ColonyObjective';
      title: string;
      description: string;
      progress: number;
    } | null;
    changelog?: Array<{
      __typename?: 'ColonyMetadataChangelog';
      transactionHash: string;
      oldDisplayName: string;
      newDisplayName: string;
      hasAvatarChanged: boolean;
      hasDescriptionChanged?: boolean | null;
      haveExternalLinksChanged?: boolean | null;
      hasObjectiveChanged?: boolean | null;
    }> | null;
  } | null;
  payments?: Array<{ __typename?: 'Payment'; recipientAddress: string }> | null;
};

export type ColonyFragment = {
  __typename?: 'Colony';
  colonyAddress: string;
  nativeToken: { __typename?: 'Token'; symbol: string; tokenAddress: string };
  tokens?: {
    __typename?: 'ModelColonyTokensConnection';
    items: Array<{
      __typename?: 'ColonyTokens';
      id: string;
      tokenAddress: string;
    } | null>;
  } | null;
  motionsWithUnclaimedStakes?: Array<{
    __typename?: 'ColonyUnclaimedStake';
    motionId: string;
    unclaimedRewards: Array<{
      __typename?: 'StakerRewards';
      address: string;
      isClaimed: boolean;
      rewards: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
    }>;
  }> | null;
  domains?: {
    __typename?: 'ModelDomainConnection';
    nextToken?: string | null;
    items: Array<{
      __typename?: 'Domain';
      id: string;
      nativeSkillId: string;
    } | null>;
  } | null;
};

export type ColonyMetadataFragment = {
  __typename?: 'ColonyMetadata';
  id: string;
  displayName: string;
  avatar?: string | null;
  thumbnail?: string | null;
  description?: string | null;
  externalLinks?: Array<{
    __typename?: 'ExternalLink';
    name: ExternalLinks;
    link: string;
  }> | null;
  objective?: {
    __typename?: 'ColonyObjective';
    title: string;
    description: string;
    progress: number;
  } | null;
  changelog?: Array<{
    __typename?: 'ColonyMetadataChangelog';
    transactionHash: string;
    oldDisplayName: string;
    newDisplayName: string;
    hasAvatarChanged: boolean;
    hasDescriptionChanged?: boolean | null;
    haveExternalLinksChanged?: boolean | null;
    hasObjectiveChanged?: boolean | null;
  }> | null;
};

export type ColonyWithRootRolesFragment = {
  __typename?: 'Colony';
  id: string;
  roles?: {
    __typename?: 'ModelColonyRoleConnection';
    items: Array<{
      __typename?: 'ColonyRole';
      id: string;
      targetUser?: {
        __typename?: 'User';
        id: string;
        profile?: {
          __typename?: 'Profile';
          displayName?: string | null;
          id: string;
        } | null;
        notificationsData?: {
          __typename?: 'NotificationsData';
          magicbellUserId: string;
          notificationsDisabled: boolean;
          mutedColonyAddresses: Array<string>;
          paymentNotificationsDisabled: boolean;
          mentionNotificationsDisabled: boolean;
          adminNotificationsDisabled: boolean;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type ExpenditureBalanceFragment = {
  __typename?: 'ExpenditureBalance';
  tokenAddress: string;
  amount: string;
};

export type ExpenditureFragment = {
  __typename?: 'Expenditure';
  id: string;
  status: ExpenditureStatus;
  ownerAddress: string;
  userStakeId?: string | null;
  createdAt: string;
  firstEditTransactionHash?: string | null;
  splitPaymentPayoutClaimedNotificationSent?: boolean | null;
  type: ExpenditureType;
  slots: Array<{
    __typename?: 'ExpenditureSlot';
    id: number;
    recipientAddress?: string | null;
    claimDelay?: string | null;
    payoutModifier?: number | null;
    payouts?: Array<{
      __typename?: 'ExpenditurePayout';
      tokenAddress: string;
      amount: string;
      isClaimed: boolean;
      networkFee?: string | null;
    }> | null;
  }>;
  motions?: {
    __typename?: 'ModelColonyMotionConnection';
    items: Array<{
      __typename?: 'ColonyMotion';
      transactionHash: string;
      action?: { __typename?: 'ColonyAction'; type: ColonyActionType } | null;
    } | null>;
  } | null;
  balances?: Array<{
    __typename?: 'ExpenditureBalance';
    tokenAddress: string;
    amount: string;
  }> | null;
  metadata?: {
    __typename?: 'ExpenditureMetadata';
    distributionType?: SplitPaymentDistributionType | null;
  } | null;
  actions?: {
    __typename?: 'ModelColonyActionConnection';
    items: Array<{
      __typename?: 'ColonyAction';
      type: ColonyActionType;
      id: string;
    } | null>;
  } | null;
};

export type ExpenditureSlotFragment = {
  __typename?: 'ExpenditureSlot';
  id: number;
  recipientAddress?: string | null;
  claimDelay?: string | null;
  payoutModifier?: number | null;
  payouts?: Array<{
    __typename?: 'ExpenditurePayout';
    tokenAddress: string;
    amount: string;
    isClaimed: boolean;
    networkFee?: string | null;
  }> | null;
};

export type ExtensionFragment = {
  __typename?: 'ColonyExtension';
  id: string;
  hash: string;
  colonyId: string;
  isInitialized: boolean;
  version: number;
};

export type ColonyMotionFragment = {
  __typename?: 'ColonyMotion';
  id: string;
  nativeMotionId: string;
  requiredStake: string;
  remainingStakes: Array<string>;
  userMinStake: string;
  nativeMotionDomainId: string;
  isFinalized: boolean;
  createdBy: string;
  repSubmitted: string;
  skillRep: string;
  hasObjection: boolean;
  motionDomainId: string;
  isDecision: boolean;
  transactionHash: string;
  expenditureId?: string | null;
  motionStakes: {
    __typename?: 'MotionStakes';
    raw: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
    percentage: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
  };
  usersStakes: Array<{
    __typename?: 'UserMotionStakes';
    address: string;
    stakes: {
      __typename?: 'MotionStakes';
      raw: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
      percentage: {
        __typename?: 'MotionStakeValues';
        yay: string;
        nay: string;
      };
    };
  }>;
  stakerRewards: Array<{
    __typename?: 'StakerRewards';
    address: string;
    isClaimed: boolean;
    rewards: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
  }>;
  voterRecord: Array<{
    __typename?: 'VoterRecord';
    address: string;
    voteCount: string;
    vote?: number | null;
  }>;
  revealedVotes: {
    __typename?: 'MotionStakes';
    raw: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
    percentage: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
  };
  motionStateHistory: {
    __typename?: 'MotionStateHistory';
    hasVoted: boolean;
    hasPassed: boolean;
    hasFailed: boolean;
    hasFailedNotFinalizable: boolean;
    inRevealPhase: boolean;
    yaySideFullyStakedAt?: string | null;
    naySideFullyStakedAt?: string | null;
    allVotesSubmittedAt?: string | null;
    allVotesRevealedAt?: string | null;
    endedAt?: string | null;
    finalizedAt?: string | null;
  };
};

export type VoterRecordFragment = {
  __typename?: 'VoterRecord';
  address: string;
  voteCount: string;
  vote?: number | null;
};

export type StakerRewardFragment = {
  __typename?: 'StakerRewards';
  address: string;
  isClaimed: boolean;
  rewards: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
};

export type MotionStakesFragment = {
  __typename?: 'MotionStakes';
  raw: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
  percentage: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
};

export type UserMotionStakesFragment = {
  __typename?: 'UserMotionStakes';
  address: string;
  stakes: {
    __typename?: 'MotionStakes';
    raw: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
    percentage: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
  };
};

export type DomainMetadataFragment = {
  __typename?: 'DomainMetadata';
  name: string;
  color: DomainColor;
  description?: string | null;
  changelog?: Array<{
    __typename?: 'DomainMetadataChangelog';
    transactionHash: string;
    oldName: string;
    newName: string;
    oldColor: DomainColor;
    newColor: DomainColor;
    oldDescription?: string | null;
    newDescription?: string | null;
  }> | null;
};

export type MultiSigUserSignatureFragment = {
  __typename?: 'MultiSigUserSignature';
  id: string;
  multiSigId: string;
  role: number;
  colonyAddress: string;
  userAddress: string;
  vote: MultiSigVote;
  createdAt: string;
};

export type ColonyMultiSigFragment = {
  __typename?: 'ColonyMultiSig';
  id: string;
  colonyAddress: string;
  nativeMultiSigId: string;
  multiSigDomainId: string;
  nativeMultiSigDomainId: string;
  requiredPermissions: number;
  transactionHash: string;
  isExecuted: boolean;
  isRejected: boolean;
  isDecision: boolean;
  hasActionCompleted: boolean;
  executedAt?: string | null;
  executedBy?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
  createdAt: string;
  expenditureId?: string | null;
  signatures?: {
    __typename?: 'ModelMultiSigUserSignatureConnection';
    items: Array<{
      __typename?: 'MultiSigUserSignature';
      id: string;
      multiSigId: string;
      role: number;
      colonyAddress: string;
      userAddress: string;
      vote: MultiSigVote;
      createdAt: string;
    } | null>;
  } | null;
  action?: { __typename?: 'ColonyAction'; type: ColonyActionType } | null;
};

export type ProxyColonyFragment = {
  __typename?: 'ProxyColony';
  id: string;
  colonyAddress: string;
  chainId: string;
  isActive: boolean;
};

export type TokenFragment = {
  __typename?: 'Token';
  symbol: string;
  tokenAddress: string;
};

export type NotificationUserFragment = {
  __typename?: 'ColonyContributor';
  user?: {
    __typename?: 'User';
    notificationsData?: {
      __typename?: 'NotificationsData';
      magicbellUserId: string;
      notificationsDisabled: boolean;
      mutedColonyAddresses: Array<string>;
      paymentNotificationsDisabled: boolean;
      mentionNotificationsDisabled: boolean;
      adminNotificationsDisabled: boolean;
    } | null;
  } | null;
};

export type NotificationsDataFragment = {
  __typename?: 'NotificationsData';
  magicbellUserId: string;
  notificationsDisabled: boolean;
  mutedColonyAddresses: Array<string>;
  paymentNotificationsDisabled: boolean;
  mentionNotificationsDisabled: boolean;
  adminNotificationsDisabled: boolean;
};

export type CreateColonyActionMutationVariables = Exact<{
  input: CreateColonyActionInput;
}>;

export type CreateColonyActionMutation = {
  __typename?: 'Mutation';
  createColonyAction?: { __typename?: 'ColonyAction'; id: string } | null;
};

export type UpdateColonyActionMutationVariables = Exact<{
  input: UpdateColonyActionInput;
}>;

export type UpdateColonyActionMutation = {
  __typename?: 'Mutation';
  updateColonyAction?: { __typename?: 'ColonyAction'; id: string } | null;
};

export type UpdateColonyMutationVariables = Exact<{
  input: UpdateColonyInput;
}>;

export type UpdateColonyMutation = {
  __typename?: 'Mutation';
  updateColony?: { __typename?: 'Colony'; id: string } | null;
};

export type UpdateColonyMetadataMutationVariables = Exact<{
  input: UpdateColonyMetadataInput;
}>;

export type UpdateColonyMetadataMutation = {
  __typename?: 'Mutation';
  updateColonyMetadata?: { __typename?: 'ColonyMetadata'; id: string } | null;
};

export type CreateColonyMutationVariables = Exact<{
  input: CreateColonyInput;
  condition?: InputMaybe<ModelColonyConditionInput>;
}>;

export type CreateColonyMutation = {
  __typename?: 'Mutation';
  createColony?: { __typename?: 'Colony'; id: string } | null;
};

export type CreateColonyMetadataMutationVariables = Exact<{
  input: CreateColonyMetadataInput;
}>;

export type CreateColonyMetadataMutation = {
  __typename?: 'Mutation';
  createColonyMetadata?: { __typename?: 'ColonyMetadata'; id: string } | null;
};

export type DeleteColonyMetadataMutationVariables = Exact<{
  input: DeleteColonyMetadataInput;
}>;

export type DeleteColonyMetadataMutation = {
  __typename?: 'Mutation';
  deleteColonyMetadata?: { __typename?: 'ColonyMetadata'; id: string } | null;
};

export type CreateColonyMemberInviteMutationVariables = Exact<{
  input: CreateColonyMemberInviteInput;
  condition?: InputMaybe<ModelColonyMemberInviteConditionInput>;
}>;

export type CreateColonyMemberInviteMutation = {
  __typename?: 'Mutation';
  createColonyMemberInvite?: {
    __typename?: 'ColonyMemberInvite';
    id: string;
  } | null;
};

export type CreateColonyTokensMutationVariables = Exact<{
  input: CreateColonyTokensInput;
}>;

export type CreateColonyTokensMutation = {
  __typename?: 'Mutation';
  createColonyTokens?: { __typename?: 'ColonyTokens'; id: string } | null;
};

export type CreateColonyContributorMutationVariables = Exact<{
  input: CreateColonyContributorInput;
}>;

export type CreateColonyContributorMutation = {
  __typename?: 'Mutation';
  createColonyContributor?: {
    __typename?: 'ColonyContributor';
    id: string;
  } | null;
};

export type UpdateColonyContributorMutationVariables = Exact<{
  input: UpdateColonyContributorInput;
}>;

export type UpdateColonyContributorMutation = {
  __typename?: 'Mutation';
  updateColonyContributor?: {
    __typename?: 'ColonyContributor';
    id: string;
  } | null;
};

export type DeleteColonyContributorMutationVariables = Exact<{
  input: DeleteColonyContributorInput;
}>;

export type DeleteColonyContributorMutation = {
  __typename?: 'Mutation';
  deleteColonyContributor?: {
    __typename?: 'ColonyContributor';
    id: string;
  } | null;
};

export type CreateCurrentVersionMutationVariables = Exact<{
  input: CreateCurrentVersionInput;
}>;

export type CreateCurrentVersionMutation = {
  __typename?: 'Mutation';
  createCurrentVersion?: { __typename?: 'CurrentVersion'; id: string } | null;
};

export type UpdateCurrentVersionMutationVariables = Exact<{
  input: UpdateCurrentVersionInput;
}>;

export type UpdateCurrentVersionMutation = {
  __typename?: 'Mutation';
  updateCurrentVersion?: { __typename?: 'CurrentVersion'; id: string } | null;
};

export type UpdateColonyDecisionMutationVariables = Exact<{
  id: Scalars['ID'];
  showInDecisionsList: Scalars['Boolean'];
}>;

export type UpdateColonyDecisionMutation = {
  __typename?: 'Mutation';
  updateColonyDecision?: { __typename?: 'ColonyDecision'; id: string } | null;
};

export type CreateDomainMutationVariables = Exact<{
  input: CreateDomainInput;
}>;

export type CreateDomainMutation = {
  __typename?: 'Mutation';
  createDomain?: { __typename?: 'Domain'; id: string } | null;
};

export type CreateDomainMetadataMutationVariables = Exact<{
  input: CreateDomainMetadataInput;
}>;

export type CreateDomainMetadataMutation = {
  __typename?: 'Mutation';
  createDomainMetadata?: { __typename?: 'DomainMetadata'; id: string } | null;
};

export type UpdateDomainMetadataMutationVariables = Exact<{
  input: UpdateDomainMetadataInput;
}>;

export type UpdateDomainMetadataMutation = {
  __typename?: 'Mutation';
  updateDomainMetadata?: { __typename?: 'DomainMetadata'; id: string } | null;
};

export type CreateContractEventMutationVariables = Exact<{
  input: CreateContractEventInput;
  condition?: InputMaybe<ModelContractEventConditionInput>;
}>;

export type CreateContractEventMutation = {
  __typename?: 'Mutation';
  createContractEvent?: { __typename?: 'ContractEvent'; id: string } | null;
};

export type CreateExpenditureMutationVariables = Exact<{
  input: CreateExpenditureInput;
}>;

export type CreateExpenditureMutation = {
  __typename?: 'Mutation';
  createExpenditure?: { __typename?: 'Expenditure'; id: string } | null;
};

export type UpdateExpenditureMutationVariables = Exact<{
  input: UpdateExpenditureInput;
}>;

export type UpdateExpenditureMutation = {
  __typename?: 'Mutation';
  updateExpenditure?: {
    __typename?: 'Expenditure';
    id: string;
    ownerAddress: string;
  } | null;
};

export type UpdateExpenditureMetadataMutationVariables = Exact<{
  input: UpdateExpenditureMetadataInput;
}>;

export type UpdateExpenditureMetadataMutation = {
  __typename?: 'Mutation';
  updateExpenditureMetadata?: {
    __typename?: 'ExpenditureMetadata';
    id: string;
  } | null;
};

export type CreateStreamingPaymentMutationVariables = Exact<{
  input: CreateStreamingPaymentInput;
}>;

export type CreateStreamingPaymentMutation = {
  __typename?: 'Mutation';
  createStreamingPayment?: {
    __typename?: 'StreamingPayment';
    id: string;
  } | null;
};

export type UpdateStreamingPaymentMutationVariables = Exact<{
  input: UpdateStreamingPaymentInput;
}>;

export type UpdateStreamingPaymentMutation = {
  __typename?: 'Mutation';
  updateStreamingPayment?: {
    __typename?: 'StreamingPayment';
    id: string;
  } | null;
};

export type CreateColonyExtensionMutationVariables = Exact<{
  input: CreateColonyExtensionInput;
}>;

export type CreateColonyExtensionMutation = {
  __typename?: 'Mutation';
  createColonyExtension?: { __typename?: 'ColonyExtension'; id: string } | null;
};

export type UpdateColonyExtensionByAddressMutationVariables = Exact<{
  input: UpdateColonyExtensionInput;
}>;

export type UpdateColonyExtensionByAddressMutation = {
  __typename?: 'Mutation';
  updateColonyExtension?: {
    __typename?: 'ColonyExtension';
    id: string;
    extensionHash: string;
    colonyAddress: string;
  } | null;
};

export type CreateExtensionInstallationsCountMutationVariables = Exact<{
  input: CreateExtensionInstallationsCountInput;
}>;

export type CreateExtensionInstallationsCountMutation = {
  __typename?: 'Mutation';
  createExtensionInstallationsCount?: {
    __typename?: 'ExtensionInstallationsCount';
    id: string;
  } | null;
};

export type UpdateExtensionInstallationsCountMutationVariables = Exact<{
  input: UpdateExtensionInstallationsCountInput;
}>;

export type UpdateExtensionInstallationsCountMutation = {
  __typename?: 'Mutation';
  updateExtensionInstallationsCount?: {
    __typename?: 'ExtensionInstallationsCount';
    id: string;
  } | null;
};

export type CreateColonyFundsClaimMutationVariables = Exact<{
  input: CreateColonyFundsClaimInput;
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
}>;

export type CreateColonyFundsClaimMutation = {
  __typename?: 'Mutation';
  createColonyFundsClaim?: {
    __typename?: 'ColonyFundsClaim';
    id: string;
  } | null;
};

export type UpdateColonyFundsClaimMutationVariables = Exact<{
  input: UpdateColonyFundsClaimInput;
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
}>;

export type UpdateColonyFundsClaimMutation = {
  __typename?: 'Mutation';
  updateColonyFundsClaim?: {
    __typename?: 'ColonyFundsClaim';
    id: string;
  } | null;
};

export type DeleteColonyFundsClaimMutationVariables = Exact<{
  input: DeleteColonyFundsClaimInput;
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
}>;

export type DeleteColonyFundsClaimMutation = {
  __typename?: 'Mutation';
  deleteColonyFundsClaim?: {
    __typename?: 'ColonyFundsClaim';
    id: string;
  } | null;
};

export type CreateCurrentNetworkInverseFeeMutationVariables = Exact<{
  input: CreateCurrentNetworkInverseFeeInput;
}>;

export type CreateCurrentNetworkInverseFeeMutation = {
  __typename?: 'Mutation';
  createCurrentNetworkInverseFee?: {
    __typename?: 'CurrentNetworkInverseFee';
    id: string;
  } | null;
};

export type UpdateCurrentNetworkInverseFeeMutationVariables = Exact<{
  input: UpdateCurrentNetworkInverseFeeInput;
}>;

export type UpdateCurrentNetworkInverseFeeMutation = {
  __typename?: 'Mutation';
  updateCurrentNetworkInverseFee?: {
    __typename?: 'CurrentNetworkInverseFee';
    id: string;
  } | null;
};

export type CreateColonyMotionMutationVariables = Exact<{
  input: CreateColonyMotionInput;
}>;

export type CreateColonyMotionMutation = {
  __typename?: 'Mutation';
  createColonyMotion?: { __typename?: 'ColonyMotion'; id: string } | null;
};

export type UpdateColonyMotionMutationVariables = Exact<{
  input: UpdateColonyMotionInput;
}>;

export type UpdateColonyMotionMutation = {
  __typename?: 'Mutation';
  updateColonyMotion?: { __typename?: 'ColonyMotion'; id: string } | null;
};

export type CreateMotionMessageMutationVariables = Exact<{
  input: CreateMotionMessageInput;
}>;

export type CreateMotionMessageMutation = {
  __typename?: 'Mutation';
  createMotionMessage?: { __typename?: 'MotionMessage'; id: string } | null;
};

export type CreateUserVoterRewardMutationVariables = Exact<{
  input: CreateVoterRewardsHistoryInput;
}>;

export type CreateUserVoterRewardMutation = {
  __typename?: 'Mutation';
  createVoterRewardsHistory?: {
    __typename?: 'VoterRewardsHistory';
    id: string;
  } | null;
};

export type CreateColonyMultiSigMutationVariables = Exact<{
  input: CreateColonyMultiSigInput;
}>;

export type CreateColonyMultiSigMutation = {
  __typename?: 'Mutation';
  createColonyMultiSig?: { __typename?: 'ColonyMultiSig'; id: string } | null;
};

export type UpdateColonyMultiSigMutationVariables = Exact<{
  input: UpdateColonyMultiSigInput;
}>;

export type UpdateColonyMultiSigMutation = {
  __typename?: 'Mutation';
  updateColonyMultiSig?: { __typename?: 'ColonyMultiSig'; id: string } | null;
};

export type CreateMultiSigVoteMutationVariables = Exact<{
  input: CreateMultiSigUserSignatureInput;
}>;

export type CreateMultiSigVoteMutation = {
  __typename?: 'Mutation';
  createMultiSigUserSignature?: {
    __typename?: 'MultiSigUserSignature';
    id: string;
  } | null;
};

export type RemoveMultiSigVoteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type RemoveMultiSigVoteMutation = {
  __typename?: 'Mutation';
  deleteMultiSigUserSignature?: {
    __typename?: 'MultiSigUserSignature';
    id: string;
  } | null;
};

export type RemoveMultiSigRoleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type RemoveMultiSigRoleMutation = {
  __typename?: 'Mutation';
  deleteColonyRole?: { __typename?: 'ColonyRole'; id: string } | null;
};

export type CreateColonyRoleMutationVariables = Exact<{
  input: CreateColonyRoleInput;
}>;

export type CreateColonyRoleMutation = {
  __typename?: 'Mutation';
  createColonyRole?: { __typename?: 'ColonyRole'; id: string } | null;
};

export type UpdateColonyRoleMutationVariables = Exact<{
  input: UpdateColonyRoleInput;
}>;

export type UpdateColonyRoleMutation = {
  __typename?: 'Mutation';
  updateColonyRole?: { __typename?: 'ColonyRole'; id: string } | null;
};

export type CreateColonyHistoricRoleMutationVariables = Exact<{
  input: CreateColonyHistoricRoleInput;
}>;

export type CreateColonyHistoricRoleMutation = {
  __typename?: 'Mutation';
  createColonyHistoricRole?: {
    __typename?: 'ColonyHistoricRole';
    id: string;
  } | null;
};

export type CreateProxyColonyMutationVariables = Exact<{
  input: CreateProxyColonyInput;
}>;

export type CreateProxyColonyMutation = {
  __typename?: 'Mutation';
  createProxyColony?: { __typename?: 'ProxyColony'; id: string } | null;
};

export type UpdateReputationMiningCycleMetadataMutationVariables = Exact<{
  input: UpdateReputationMiningCycleMetadataInput;
}>;

export type UpdateReputationMiningCycleMetadataMutation = {
  __typename?: 'Mutation';
  updateReputationMiningCycleMetadata?: {
    __typename?: 'ReputationMiningCycleMetadata';
    id: string;
  } | null;
};

export type CreateReputationMiningCycleMetadataMutationVariables = Exact<{
  input: CreateReputationMiningCycleMetadataInput;
}>;

export type CreateReputationMiningCycleMetadataMutation = {
  __typename?: 'Mutation';
  createReputationMiningCycleMetadata?: {
    __typename?: 'ReputationMiningCycleMetadata';
    id: string;
  } | null;
};

export type CreateUserStakeMutationVariables = Exact<{
  input: CreateUserStakeInput;
}>;

export type CreateUserStakeMutation = {
  __typename?: 'Mutation';
  createUserStake?: { __typename?: 'UserStake'; id: string } | null;
};

export type UpdateUserStakeMutationVariables = Exact<{
  input: UpdateUserStakeInput;
}>;

export type UpdateUserStakeMutation = {
  __typename?: 'Mutation';
  updateUserStake?: { __typename?: 'UserStake'; id: string } | null;
};

export type CreateStatsMutationVariables = Exact<{
  value: Scalars['String'];
}>;

export type CreateStatsMutation = {
  __typename?: 'Mutation';
  createIngestorStats?: { __typename?: 'IngestorStats'; id: string } | null;
};

export type UpdateStatsMutationVariables = Exact<{
  value: Scalars['String'];
}>;

export type UpdateStatsMutation = {
  __typename?: 'Mutation';
  updateIngestorStats?: { __typename?: 'IngestorStats'; id: string } | null;
};

export type DeleteColonyTokensMutationVariables = Exact<{
  input: DeleteColonyTokensInput;
}>;

export type DeleteColonyTokensMutation = {
  __typename?: 'Mutation';
  deleteColonyTokens?: { __typename?: 'ColonyTokens'; id: string } | null;
};

export type GetColonyActionQueryVariables = Exact<{
  transactionHash: Scalars['ID'];
}>;

export type GetColonyActionQuery = {
  __typename?: 'Query';
  getColonyAction?: { __typename?: 'ColonyAction'; id: string } | null;
};

export type GetColonyArbitraryTransactionActionQueryVariables = Exact<{
  transactionHash: Scalars['ID'];
}>;

export type GetColonyArbitraryTransactionActionQuery = {
  __typename?: 'Query';
  getColonyAction?: {
    __typename?: 'ColonyAction';
    id: string;
    arbitraryTransactions?: Array<{
      __typename?: 'ColonyActionArbitraryTransaction';
      contractAddress: string;
      encodedFunction: string;
    }> | null;
  } | null;
};

export type GetMotionIdFromActionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetMotionIdFromActionQuery = {
  __typename?: 'Query';
  getColonyAction?: {
    __typename?: 'ColonyAction';
    motionData?: { __typename?: 'ColonyMotion'; id: string } | null;
  } | null;
};

export type GetActionIdFromAnnotationQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetActionIdFromAnnotationQuery = {
  __typename?: 'Query';
  getAnnotation?: { __typename?: 'Annotation'; actionId: string } | null;
};

export type GetActionByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetActionByIdQuery = {
  __typename?: 'Query';
  getColonyAction?: {
    __typename?: 'ColonyAction';
    id: string;
    type: ColonyActionType;
    expenditureSlotChanges?: {
      __typename?: 'ExpenditureSlotChanges';
      oldSlots: Array<{
        __typename?: 'ExpenditureSlot';
        id: number;
        recipientAddress?: string | null;
        claimDelay?: string | null;
        payoutModifier?: number | null;
        payouts?: Array<{
          __typename?: 'ExpenditurePayout';
          tokenAddress: string;
          amount: string;
          isClaimed: boolean;
          networkFee?: string | null;
        }> | null;
      }>;
      newSlots: Array<{
        __typename?: 'ExpenditureSlot';
        id: number;
        recipientAddress?: string | null;
        claimDelay?: string | null;
        payoutModifier?: number | null;
        payouts?: Array<{
          __typename?: 'ExpenditurePayout';
          tokenAddress: string;
          amount: string;
          isClaimed: boolean;
          networkFee?: string | null;
        }> | null;
      }>;
    } | null;
  } | null;
};

export type GetColonyMetadataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyMetadataQuery = {
  __typename?: 'Query';
  getColonyMetadata?: {
    __typename?: 'ColonyMetadata';
    id: string;
    displayName: string;
    avatar?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    etherealData?: {
      __typename?: 'ColonyMetadataEtherealData';
      colonyAvatar?: string | null;
      colonyDisplayName: string;
      colonyName: string;
      colonyThumbnail?: string | null;
      initiatorAddress: string;
      tokenAvatar?: string | null;
      tokenThumbnail?: string | null;
    } | null;
    externalLinks?: Array<{
      __typename?: 'ExternalLink';
      name: ExternalLinks;
      link: string;
    }> | null;
    objective?: {
      __typename?: 'ColonyObjective';
      title: string;
      description: string;
      progress: number;
    } | null;
    changelog?: Array<{
      __typename?: 'ColonyMetadataChangelog';
      transactionHash: string;
      oldDisplayName: string;
      newDisplayName: string;
      hasAvatarChanged: boolean;
      hasDescriptionChanged?: boolean | null;
      haveExternalLinksChanged?: boolean | null;
      hasObjectiveChanged?: boolean | null;
    }> | null;
  } | null;
};

export type GetColonyQueryVariables = Exact<{
  id: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
}>;

export type GetColonyQuery = {
  __typename?: 'Query';
  getColony?: {
    __typename?: 'Colony';
    colonyAddress: string;
    nativeToken: { __typename?: 'Token'; symbol: string; tokenAddress: string };
    tokens?: {
      __typename?: 'ModelColonyTokensConnection';
      items: Array<{
        __typename?: 'ColonyTokens';
        id: string;
        tokenAddress: string;
      } | null>;
    } | null;
    motionsWithUnclaimedStakes?: Array<{
      __typename?: 'ColonyUnclaimedStake';
      motionId: string;
      unclaimedRewards: Array<{
        __typename?: 'StakerRewards';
        address: string;
        isClaimed: boolean;
        rewards: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
      }>;
    }> | null;
    domains?: {
      __typename?: 'ModelDomainConnection';
      nextToken?: string | null;
      items: Array<{
        __typename?: 'Domain';
        id: string;
        nativeSkillId: string;
      } | null>;
    } | null;
  } | null;
  getColonyByAddress?: {
    __typename?: 'ModelColonyConnection';
    items: Array<{ __typename?: 'Colony'; id: string; name: string } | null>;
  } | null;
  getColonyByType?: {
    __typename?: 'ModelColonyConnection';
    items: Array<{ __typename?: 'Colony'; id: string; name: string } | null>;
  } | null;
};

export type GetColonyByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;

export type GetColonyByNameQuery = {
  __typename?: 'Query';
  getColonyByName?: {
    __typename?: 'ModelColonyConnection';
    items: Array<{ __typename?: 'Colony'; id: string; name: string } | null>;
  } | null;
};

export type GetColonyByNativeTokenIdQueryVariables = Exact<{
  nativeTokenId: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;

export type GetColonyByNativeTokenIdQuery = {
  __typename?: 'Query';
  getColoniesByNativeTokenId?: {
    __typename?: 'ModelColonyConnection';
    nextToken?: string | null;
    items: Array<{
      __typename?: 'Colony';
      id: string;
      status?: {
        __typename?: 'ColonyStatus';
        recovery?: boolean | null;
        nativeToken?: {
          __typename?: 'NativeTokenStatus';
          unlocked?: boolean | null;
          unlockable?: boolean | null;
          mintable?: boolean | null;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type ListColoniesQueryVariables = Exact<{
  nextToken?: InputMaybe<Scalars['String']>;
}>;

export type ListColoniesQuery = {
  __typename?: 'Query';
  listColonies?: {
    __typename?: 'ModelColonyConnection';
    nextToken?: string | null;
    items: Array<{
      __typename?: 'Colony';
      id: string;
      nativeTokenId: string;
    } | null>;
  } | null;
};

export type ListColoniesWithRootPermissionHoldersQueryVariables = Exact<{
  nextToken?: InputMaybe<Scalars['String']>;
}>;

export type ListColoniesWithRootPermissionHoldersQuery = {
  __typename?: 'Query';
  listColonies?: {
    __typename?: 'ModelColonyConnection';
    nextToken?: string | null;
    items: Array<{
      __typename?: 'Colony';
      id: string;
      roles?: {
        __typename?: 'ModelColonyRoleConnection';
        items: Array<{
          __typename?: 'ColonyRole';
          id: string;
          targetUser?: {
            __typename?: 'User';
            id: string;
            profile?: {
              __typename?: 'Profile';
              displayName?: string | null;
              id: string;
            } | null;
            notificationsData?: {
              __typename?: 'NotificationsData';
              magicbellUserId: string;
              notificationsDisabled: boolean;
              mutedColonyAddresses: Array<string>;
              paymentNotificationsDisabled: boolean;
              mentionNotificationsDisabled: boolean;
              adminNotificationsDisabled: boolean;
            } | null;
          } | null;
        } | null>;
      } | null;
    } | null>;
  } | null;
};

export type GetColonyContributorQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyContributorQuery = {
  __typename?: 'Query';
  getColonyContributor?: {
    __typename?: 'ColonyContributor';
    id: string;
    isVerified: boolean;
  } | null;
};

export type GetColonyContributorsNotificationDataQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  sortDirection?: InputMaybe<ModelSortDirection>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;

export type GetColonyContributorsNotificationDataQuery = {
  __typename?: 'Query';
  getContributorsByColony?: {
    __typename?: 'ModelColonyContributorConnection';
    nextToken?: string | null;
    items: Array<{
      __typename?: 'ColonyContributor';
      user?: {
        __typename?: 'User';
        notificationsData?: {
          __typename?: 'NotificationsData';
          magicbellUserId: string;
          notificationsDisabled: boolean;
          mutedColonyAddresses: Array<string>;
          paymentNotificationsDisabled: boolean;
          mentionNotificationsDisabled: boolean;
          adminNotificationsDisabled: boolean;
        } | null;
      } | null;
    } | null>;
  } | null;
};

export type GetCurrentVersionQueryVariables = Exact<{
  key: Scalars['String'];
}>;

export type GetCurrentVersionQuery = {
  __typename?: 'Query';
  getCurrentVersionByKey?: {
    __typename?: 'ModelCurrentVersionConnection';
    items: Array<{
      __typename?: 'CurrentVersion';
      id: string;
      version: number;
    } | null>;
  } | null;
};

export type GetColonyDecisionByActionIdQueryVariables = Exact<{
  actionId: Scalars['ID'];
}>;

export type GetColonyDecisionByActionIdQuery = {
  __typename?: 'Query';
  getColonyDecisionByActionId?: {
    __typename?: 'ModelColonyDecisionConnection';
    items: Array<{ __typename?: 'ColonyDecision'; id: string } | null>;
  } | null;
};

export type GetDomainMetadataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetDomainMetadataQuery = {
  __typename?: 'Query';
  getDomainMetadata?: {
    __typename?: 'DomainMetadata';
    color: DomainColor;
    description?: string | null;
    id: string;
    name: string;
    changelog?: Array<{
      __typename?: 'DomainMetadataChangelog';
      newColor: DomainColor;
      newDescription?: string | null;
      newName: string;
      oldColor: DomainColor;
      oldDescription?: string | null;
      oldName: string;
      transactionHash: string;
    }> | null;
  } | null;
};

export type GetDomainByNativeSkillIdQueryVariables = Exact<{
  nativeSkillId: Scalars['String'];
  colonyAddress: Scalars['ID'];
}>;

export type GetDomainByNativeSkillIdQuery = {
  __typename?: 'Query';
  getDomainByNativeSkillId?: {
    __typename?: 'ModelDomainConnection';
    items: Array<{
      __typename?: 'Domain';
      id: string;
      nativeSkillId: string;
      nativeId: number;
    } | null>;
  } | null;
};

export type GetDomainsByExtensionAddressQueryVariables = Exact<{
  extensionAddress: Scalars['ID'];
}>;

export type GetDomainsByExtensionAddressQuery = {
  __typename?: 'Query';
  listColonyExtensions?: {
    __typename?: 'ModelColonyExtensionConnection';
    items: Array<{
      __typename?: 'ColonyExtension';
      colony: {
        __typename?: 'Colony';
        id: string;
        domains?: {
          __typename?: 'ModelDomainConnection';
          items: Array<{
            __typename?: 'Domain';
            nativeSkillId: string;
            nativeId: number;
          } | null>;
        } | null;
      };
    } | null>;
  } | null;
};

export type GetContractEventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetContractEventQuery = {
  __typename?: 'Query';
  getContractEvent?: { __typename?: 'ContractEvent'; id: string } | null;
};

export type GetExpenditureQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetExpenditureQuery = {
  __typename?: 'Query';
  getExpenditure?: {
    __typename?: 'Expenditure';
    id: string;
    status: ExpenditureStatus;
    ownerAddress: string;
    userStakeId?: string | null;
    createdAt: string;
    firstEditTransactionHash?: string | null;
    splitPaymentPayoutClaimedNotificationSent?: boolean | null;
    type: ExpenditureType;
    slots: Array<{
      __typename?: 'ExpenditureSlot';
      id: number;
      recipientAddress?: string | null;
      claimDelay?: string | null;
      payoutModifier?: number | null;
      payouts?: Array<{
        __typename?: 'ExpenditurePayout';
        tokenAddress: string;
        amount: string;
        isClaimed: boolean;
        networkFee?: string | null;
      }> | null;
    }>;
    motions?: {
      __typename?: 'ModelColonyMotionConnection';
      items: Array<{
        __typename?: 'ColonyMotion';
        transactionHash: string;
        action?: { __typename?: 'ColonyAction'; type: ColonyActionType } | null;
      } | null>;
    } | null;
    balances?: Array<{
      __typename?: 'ExpenditureBalance';
      tokenAddress: string;
      amount: string;
    }> | null;
    metadata?: {
      __typename?: 'ExpenditureMetadata';
      distributionType?: SplitPaymentDistributionType | null;
    } | null;
    actions?: {
      __typename?: 'ModelColonyActionConnection';
      items: Array<{
        __typename?: 'ColonyAction';
        type: ColonyActionType;
        id: string;
      } | null>;
    } | null;
  } | null;
};

export type GetExpenditureByNativeFundingPotIdAndColonyQueryVariables = Exact<{
  nativeFundingPotId: Scalars['Int'];
  colonyAddress: Scalars['ID'];
}>;

export type GetExpenditureByNativeFundingPotIdAndColonyQuery = {
  __typename?: 'Query';
  getExpendituresByNativeFundingPotIdAndColony?: {
    __typename?: 'ModelExpenditureConnection';
    items: Array<{
      __typename?: 'Expenditure';
      id: string;
      status: ExpenditureStatus;
      ownerAddress: string;
      userStakeId?: string | null;
      createdAt: string;
      firstEditTransactionHash?: string | null;
      splitPaymentPayoutClaimedNotificationSent?: boolean | null;
      type: ExpenditureType;
      slots: Array<{
        __typename?: 'ExpenditureSlot';
        id: number;
        recipientAddress?: string | null;
        claimDelay?: string | null;
        payoutModifier?: number | null;
        payouts?: Array<{
          __typename?: 'ExpenditurePayout';
          tokenAddress: string;
          amount: string;
          isClaimed: boolean;
          networkFee?: string | null;
        }> | null;
      }>;
      motions?: {
        __typename?: 'ModelColonyMotionConnection';
        items: Array<{
          __typename?: 'ColonyMotion';
          transactionHash: string;
          action?: {
            __typename?: 'ColonyAction';
            type: ColonyActionType;
          } | null;
        } | null>;
      } | null;
      balances?: Array<{
        __typename?: 'ExpenditureBalance';
        tokenAddress: string;
        amount: string;
      }> | null;
      metadata?: {
        __typename?: 'ExpenditureMetadata';
        distributionType?: SplitPaymentDistributionType | null;
      } | null;
      actions?: {
        __typename?: 'ModelColonyActionConnection';
        items: Array<{
          __typename?: 'ColonyAction';
          type: ColonyActionType;
          id: string;
        } | null>;
      } | null;
    } | null>;
  } | null;
};

export type GetStreamingPaymentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetStreamingPaymentQuery = {
  __typename?: 'Query';
  getStreamingPayment?: {
    __typename?: 'StreamingPayment';
    id: string;
    payouts?: Array<{
      __typename?: 'ExpenditurePayout';
      amount: string;
      tokenAddress: string;
      isClaimed: boolean;
    }> | null;
  } | null;
};

export type GetColonyExtensionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyExtensionQuery = {
  __typename?: 'Query';
  getColonyExtension?: {
    __typename?: 'ColonyExtension';
    id: string;
    hash: string;
    colonyId: string;
    isInitialized: boolean;
    version: number;
  } | null;
};

export type GetColonyExtensionsByColonyAddressQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;

export type GetColonyExtensionsByColonyAddressQuery = {
  __typename?: 'Query';
  getExtensionByColonyAndHash?: {
    __typename?: 'ModelColonyExtensionConnection';
    items: Array<{
      __typename?: 'ColonyExtension';
      id: string;
      hash: string;
      colonyId: string;
      isInitialized: boolean;
      version: number;
    } | null>;
  } | null;
};

export type ListExtensionsQueryVariables = Exact<{
  hash: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
}>;

export type ListExtensionsQuery = {
  __typename?: 'Query';
  getExtensionsByHash?: {
    __typename?: 'ModelColonyExtensionConnection';
    nextToken?: string | null;
    items: Array<{
      __typename?: 'ColonyExtension';
      id: string;
      hash: string;
      colonyId: string;
      isInitialized: boolean;
      version: number;
    } | null>;
  } | null;
};

export type GetColonyExtensionByHashAndColonyQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  extensionHash: Scalars['String'];
}>;

export type GetColonyExtensionByHashAndColonyQuery = {
  __typename?: 'Query';
  getExtensionByColonyAndHash?: {
    __typename?: 'ModelColonyExtensionConnection';
    items: Array<{ __typename?: 'ColonyExtension'; id: string } | null>;
  } | null;
};

export type GetExtensionInstallationsCountQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetExtensionInstallationsCountQuery = {
  __typename?: 'Query';
  getExtensionInstallationsCount?: {
    __typename?: 'ExtensionInstallationsCount';
    oneTxPayment: number;
    stakedExpenditure: number;
    stagedExpenditure: number;
    streamingPayments: number;
    reputationWeighted: number;
    multiSigPermissions: number;
  } | null;
};

export type GetColonyExtensionByAddressQueryVariables = Exact<{
  extensionAddress: Scalars['ID'];
}>;

export type GetColonyExtensionByAddressQuery = {
  __typename?: 'Query';
  getColonyExtension?: {
    __typename?: 'ColonyExtension';
    colonyId: string;
    params?: {
      __typename?: 'ExtensionParams';
      multiSig?: {
        __typename?: 'MultiSigParams';
        colonyThreshold: number;
        domainThresholds?: Array<{
          __typename?: 'MultiSigDomainConfig';
          domainId: string;
          domainThreshold: number;
        } | null> | null;
      } | null;
    } | null;
  } | null;
};

export type GetColonyUnclaimedFundsQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  tokenAddress: Scalars['ID'];
  upToBlock?: InputMaybe<Scalars['Int']>;
}>;

export type GetColonyUnclaimedFundsQuery = {
  __typename?: 'Query';
  listColonyFundsClaims?: {
    __typename?: 'ModelColonyFundsClaimConnection';
    items: Array<{
      __typename?: 'ColonyFundsClaim';
      id: string;
      amount: string;
      token: { __typename?: 'Token'; symbol: string; tokenAddress: string };
    } | null>;
  } | null;
};

export type GetColonyUnclaimedFundQueryVariables = Exact<{
  claimId: Scalars['ID'];
}>;

export type GetColonyUnclaimedFundQuery = {
  __typename?: 'Query';
  getColonyFundsClaim?: { __typename?: 'ColonyFundsClaim'; id: string } | null;
};

export type GetCurrentNetworkInverseFeeQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCurrentNetworkInverseFeeQuery = {
  __typename?: 'Query';
  listCurrentNetworkInverseFees?: {
    __typename?: 'ModelCurrentNetworkInverseFeeConnection';
    items: Array<{
      __typename?: 'CurrentNetworkInverseFee';
      id: string;
      inverseFee: string;
    } | null>;
  } | null;
};

export type GetColonyActionByMotionIdQueryVariables = Exact<{
  motionId: Scalars['ID'];
}>;

export type GetColonyActionByMotionIdQuery = {
  __typename?: 'Query';
  getColonyActionByMotionId?: {
    __typename?: 'ModelColonyActionConnection';
    items: Array<{
      __typename?: 'ColonyAction';
      id: string;
      colonyDecisionId?: string | null;
      amount?: string | null;
      networkFee?: string | null;
      type: ColonyActionType;
      showInActionsList: boolean;
      colonyId: string;
      initiatorAddress: string;
      recipientAddress?: string | null;
      members?: Array<string> | null;
      pendingDomainMetadata?: {
        __typename?: 'DomainMetadata';
        name: string;
        color: DomainColor;
        description?: string | null;
        changelog?: Array<{
          __typename?: 'DomainMetadataChangelog';
          transactionHash: string;
          oldName: string;
          newName: string;
          oldColor: DomainColor;
          newColor: DomainColor;
          oldDescription?: string | null;
          newDescription?: string | null;
        }> | null;
      } | null;
      pendingColonyMetadata?: {
        __typename?: 'ColonyMetadata';
        id: string;
        displayName: string;
        avatar?: string | null;
        thumbnail?: string | null;
        description?: string | null;
        externalLinks?: Array<{
          __typename?: 'ExternalLink';
          name: ExternalLinks;
          link: string;
        }> | null;
        objective?: {
          __typename?: 'ColonyObjective';
          title: string;
          description: string;
          progress: number;
        } | null;
        changelog?: Array<{
          __typename?: 'ColonyMetadataChangelog';
          transactionHash: string;
          oldDisplayName: string;
          newDisplayName: string;
          hasAvatarChanged: boolean;
          hasDescriptionChanged?: boolean | null;
          haveExternalLinksChanged?: boolean | null;
          hasObjectiveChanged?: boolean | null;
        }> | null;
      } | null;
      payments?: Array<{
        __typename?: 'Payment';
        recipientAddress: string;
      }> | null;
    } | null>;
  } | null;
};

export type GetColonyMotionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyMotionQuery = {
  __typename?: 'Query';
  getColonyMotion?: {
    __typename?: 'ColonyMotion';
    id: string;
    nativeMotionId: string;
    requiredStake: string;
    remainingStakes: Array<string>;
    userMinStake: string;
    nativeMotionDomainId: string;
    isFinalized: boolean;
    createdBy: string;
    repSubmitted: string;
    skillRep: string;
    hasObjection: boolean;
    motionDomainId: string;
    isDecision: boolean;
    transactionHash: string;
    expenditureId?: string | null;
    motionStakes: {
      __typename?: 'MotionStakes';
      raw: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
      percentage: {
        __typename?: 'MotionStakeValues';
        nay: string;
        yay: string;
      };
    };
    usersStakes: Array<{
      __typename?: 'UserMotionStakes';
      address: string;
      stakes: {
        __typename?: 'MotionStakes';
        raw: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
        percentage: {
          __typename?: 'MotionStakeValues';
          yay: string;
          nay: string;
        };
      };
    }>;
    stakerRewards: Array<{
      __typename?: 'StakerRewards';
      address: string;
      isClaimed: boolean;
      rewards: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
    }>;
    voterRecord: Array<{
      __typename?: 'VoterRecord';
      address: string;
      voteCount: string;
      vote?: number | null;
    }>;
    revealedVotes: {
      __typename?: 'MotionStakes';
      raw: { __typename?: 'MotionStakeValues'; yay: string; nay: string };
      percentage: {
        __typename?: 'MotionStakeValues';
        yay: string;
        nay: string;
      };
    };
    motionStateHistory: {
      __typename?: 'MotionStateHistory';
      hasVoted: boolean;
      hasPassed: boolean;
      hasFailed: boolean;
      hasFailedNotFinalizable: boolean;
      inRevealPhase: boolean;
      yaySideFullyStakedAt?: string | null;
      naySideFullyStakedAt?: string | null;
      allVotesSubmittedAt?: string | null;
      allVotesRevealedAt?: string | null;
      endedAt?: string | null;
      finalizedAt?: string | null;
    };
  } | null;
};

export type GetVoterRewardsQueryVariables = Exact<{
  input: GetVoterRewardsInput;
}>;

export type GetVoterRewardsQuery = {
  __typename?: 'Query';
  getVoterRewards?: {
    __typename?: 'VoterRewardsReturn';
    min: string;
    max: string;
    reward: string;
  } | null;
};

export type GetColonyActionByMultiSigIdQueryVariables = Exact<{
  multiSigId: Scalars['ID'];
}>;

export type GetColonyActionByMultiSigIdQuery = {
  __typename?: 'Query';
  getColonyActionByMultiSigId?: {
    __typename?: 'ModelColonyActionConnection';
    items: Array<{
      __typename?: 'ColonyAction';
      id: string;
      colonyDecisionId?: string | null;
      amount?: string | null;
      networkFee?: string | null;
      type: ColonyActionType;
      showInActionsList: boolean;
      colonyId: string;
      initiatorAddress: string;
      recipientAddress?: string | null;
      members?: Array<string> | null;
      pendingDomainMetadata?: {
        __typename?: 'DomainMetadata';
        name: string;
        color: DomainColor;
        description?: string | null;
        changelog?: Array<{
          __typename?: 'DomainMetadataChangelog';
          transactionHash: string;
          oldName: string;
          newName: string;
          oldColor: DomainColor;
          newColor: DomainColor;
          oldDescription?: string | null;
          newDescription?: string | null;
        }> | null;
      } | null;
      pendingColonyMetadata?: {
        __typename?: 'ColonyMetadata';
        id: string;
        displayName: string;
        avatar?: string | null;
        thumbnail?: string | null;
        description?: string | null;
        externalLinks?: Array<{
          __typename?: 'ExternalLink';
          name: ExternalLinks;
          link: string;
        }> | null;
        objective?: {
          __typename?: 'ColonyObjective';
          title: string;
          description: string;
          progress: number;
        } | null;
        changelog?: Array<{
          __typename?: 'ColonyMetadataChangelog';
          transactionHash: string;
          oldDisplayName: string;
          newDisplayName: string;
          hasAvatarChanged: boolean;
          hasDescriptionChanged?: boolean | null;
          haveExternalLinksChanged?: boolean | null;
          hasObjectiveChanged?: boolean | null;
        }> | null;
      } | null;
      payments?: Array<{
        __typename?: 'Payment';
        recipientAddress: string;
      }> | null;
    } | null>;
  } | null;
};

export type GetColonyMultiSigQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyMultiSigQuery = {
  __typename?: 'Query';
  getColonyMultiSig?: {
    __typename?: 'ColonyMultiSig';
    id: string;
    colonyAddress: string;
    nativeMultiSigId: string;
    multiSigDomainId: string;
    nativeMultiSigDomainId: string;
    requiredPermissions: number;
    transactionHash: string;
    isExecuted: boolean;
    isRejected: boolean;
    isDecision: boolean;
    hasActionCompleted: boolean;
    executedAt?: string | null;
    executedBy?: string | null;
    rejectedAt?: string | null;
    rejectedBy?: string | null;
    createdAt: string;
    expenditureId?: string | null;
    signatures?: {
      __typename?: 'ModelMultiSigUserSignatureConnection';
      items: Array<{
        __typename?: 'MultiSigUserSignature';
        id: string;
        multiSigId: string;
        role: number;
        colonyAddress: string;
        userAddress: string;
        vote: MultiSigVote;
        createdAt: string;
      } | null>;
    } | null;
    action?: { __typename?: 'ColonyAction'; type: ColonyActionType } | null;
  } | null;
};

export type GetUserMultiSigSignatureQueryVariables = Exact<{
  multiSigId: Scalars['ID'];
  userAddress: Scalars['ID'];
  vote: MultiSigVote;
  role: Scalars['Int'];
}>;

export type GetUserMultiSigSignatureQuery = {
  __typename?: 'Query';
  getMultiSigUserSignatureByMultiSigId?: {
    __typename?: 'ModelMultiSigUserSignatureConnection';
    items: Array<{
      __typename?: 'MultiSigUserSignature';
      id: string;
      multiSigId: string;
      role: number;
      colonyAddress: string;
      userAddress: string;
      vote: MultiSigVote;
      createdAt: string;
    } | null>;
  } | null;
};

export type GetAllMultiSigRolesQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;

export type GetAllMultiSigRolesQuery = {
  __typename?: 'Query';
  getRoleByColony?: {
    __typename?: 'ModelColonyRoleConnection';
    items: Array<{ __typename?: 'ColonyRole'; id: string } | null>;
  } | null;
};

export type GetActiveColonyMultisigsQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;

export type GetActiveColonyMultisigsQuery = {
  __typename?: 'Query';
  getMultiSigByColonyAddress?: {
    __typename?: 'ModelColonyMultiSigConnection';
    items: Array<{ __typename?: 'ColonyMultiSig'; id: string } | null>;
  } | null;
};

export type GetColonyRoleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyRoleQuery = {
  __typename?: 'Query';
  getColonyRole?: {
    __typename?: 'ColonyRole';
    id: string;
    latestBlock: number;
    role_0?: boolean | null;
    role_1?: boolean | null;
    role_2?: boolean | null;
    role_3?: boolean | null;
    role_5?: boolean | null;
    role_6?: boolean | null;
  } | null;
};

export type GetAllColonyRolesQueryVariables = Exact<{
  targetAddress: Scalars['ID'];
  colonyAddress: Scalars['ID'];
}>;

export type GetAllColonyRolesQuery = {
  __typename?: 'Query';
  getRoleByTargetAddressAndColony?: {
    __typename?: 'ModelColonyRoleConnection';
    items: Array<{
      __typename?: 'ColonyRole';
      id: string;
      role_0?: boolean | null;
      role_1?: boolean | null;
      role_2?: boolean | null;
      role_3?: boolean | null;
      role_5?: boolean | null;
      role_6?: boolean | null;
    } | null>;
  } | null;
};

export type GetColonyHistoricRoleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyHistoricRoleQuery = {
  __typename?: 'Query';
  getColonyHistoricRole?: {
    __typename?: 'ColonyHistoricRole';
    id: string;
  } | null;
};

export type GetReputationMiningCycleMetadataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetReputationMiningCycleMetadataQuery = {
  __typename?: 'Query';
  getReputationMiningCycleMetadata?: {
    __typename?: 'ReputationMiningCycleMetadata';
    id: string;
  } | null;
};

export type GetSafeTransactionByTransactionHashQueryVariables = Exact<{
  transactionHash: Scalars['ID'];
}>;

export type GetSafeTransactionByTransactionHashQuery = {
  __typename?: 'Query';
  getSafeTransaction?: { __typename?: 'SafeTransaction'; id: string } | null;
};

export type GetUserStakeQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetUserStakeQuery = {
  __typename?: 'Query';
  getUserStake?: {
    __typename?: 'UserStake';
    id: string;
    amount: string;
  } | null;
};

export type GetStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetStatsQuery = {
  __typename?: 'Query';
  getIngestorStats?: { __typename?: 'IngestorStats'; value: string } | null;
};

export type GetTokenFromEverywhereQueryVariables = Exact<{
  input: TokenFromEverywhereArguments;
}>;

export type GetTokenFromEverywhereQuery = {
  __typename?: 'Query';
  getTokenFromEverywhere?: {
    __typename?: 'TokenFromEverywhereReturn';
    items?: Array<{ __typename?: 'Token'; id: string } | null> | null;
  } | null;
};

export type GetNotificationUsersQueryVariables = Exact<{
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
}>;

export type GetNotificationUsersQuery = {
  __typename?: 'Query';
  listUsers?: {
    __typename?: 'ModelUserConnection';
    items: Array<{
      __typename?: 'User';
      notificationsData?: {
        __typename?: 'NotificationsData';
        magicbellUserId: string;
        notificationsDisabled: boolean;
        mutedColonyAddresses: Array<string>;
        paymentNotificationsDisabled: boolean;
        mentionNotificationsDisabled: boolean;
        adminNotificationsDisabled: boolean;
      } | null;
    } | null>;
  } | null;
};

export const DomainMetadata = gql`
  fragment DomainMetadata on DomainMetadata {
    name
    color
    description
    changelog {
      transactionHash
      oldName
      newName
      oldColor
      newColor
      oldDescription
      newDescription
    }
  }
`;
export const ColonyMetadata = gql`
  fragment ColonyMetadata on ColonyMetadata {
    id
    displayName
    avatar
    thumbnail
    description
    externalLinks {
      name
      link
    }
    objective {
      title
      description
      progress
    }
    changelog {
      transactionHash
      oldDisplayName
      newDisplayName
      hasAvatarChanged
      hasDescriptionChanged
      haveExternalLinksChanged
      hasObjectiveChanged
    }
  }
`;
export const ActionMetadataInfo = gql`
  fragment ActionMetadataInfo on ColonyAction {
    id
    pendingDomainMetadata {
      ...DomainMetadata
    }
    pendingColonyMetadata {
      ...ColonyMetadata
    }
    colonyDecisionId
    amount
    networkFee
    type
    showInActionsList
    colonyId
    initiatorAddress
    recipientAddress
    payments {
      recipientAddress
    }
    members
  }
  ${DomainMetadata}
  ${ColonyMetadata}
`;
export const Token = gql`
  fragment Token on Token {
    tokenAddress: id
    symbol
  }
`;
export const Colony = gql`
  fragment Colony on Colony {
    colonyAddress: id
    nativeToken {
      ...Token
    }
    tokens {
      items {
        id
        tokenAddress: tokenID
      }
    }
    motionsWithUnclaimedStakes {
      motionId
      unclaimedRewards {
        address
        rewards {
          yay
          nay
        }
        isClaimed
      }
    }
    domains(limit: 1000, nextToken: $nextToken) {
      items {
        id
        nativeSkillId
      }
      nextToken
    }
  }
  ${Token}
`;
export const NotificationsData = gql`
  fragment NotificationsData on NotificationsData {
    magicbellUserId
    notificationsDisabled
    mutedColonyAddresses
    paymentNotificationsDisabled
    mentionNotificationsDisabled
    adminNotificationsDisabled
  }
`;
export const ColonyWithRootRoles = gql`
  fragment ColonyWithRootRoles on Colony {
    id
    roles(filter: { role_1: { eq: true } }, limit: 1000) {
      items {
        id
        targetUser {
          id
          profile {
            displayName
            id
          }
          notificationsData {
            ...NotificationsData
          }
        }
      }
    }
  }
  ${NotificationsData}
`;
export const ExpenditureSlot = gql`
  fragment ExpenditureSlot on ExpenditureSlot {
    id
    recipientAddress
    claimDelay
    payoutModifier
    payouts {
      tokenAddress
      amount
      isClaimed
      networkFee
    }
  }
`;
export const ExpenditureBalance = gql`
  fragment ExpenditureBalance on ExpenditureBalance {
    tokenAddress
    amount
  }
`;
export const Expenditure = gql`
  fragment Expenditure on Expenditure {
    id
    slots {
      ...ExpenditureSlot
    }
    motions {
      items {
        transactionHash
        action {
          type
        }
      }
    }
    balances {
      ...ExpenditureBalance
    }
    status
    ownerAddress
    userStakeId
    createdAt
    firstEditTransactionHash
    type
    actions {
      items {
        type
        id
      }
    }
  }
  ${ExpenditureSlot}
  ${ExpenditureBalance}
`;
export const Extension = gql`
  fragment Extension on ColonyExtension {
    id
    hash
    colonyId
    isInitialized
    version
  }
`;
export const MotionStakes = gql`
  fragment MotionStakes on MotionStakes {
    raw {
      nay
      yay
    }
    percentage {
      nay
      yay
    }
  }
`;
export const UserMotionStakes = gql`
  fragment UserMotionStakes on UserMotionStakes {
    address
    stakes {
      raw {
        yay
        nay
      }
      percentage {
        yay
        nay
      }
    }
  }
}
    ${NotificationsData}`;
export const ExpenditureSlot = gql`
  fragment ExpenditureSlot on ExpenditureSlot {
    id
    recipientAddress
    claimDelay
    payoutModifier
    payouts {
      tokenAddress
      amount
      isClaimed
      networkFee
    }
  }
`;
export const ExpenditureBalance = gql`
  fragment ExpenditureBalance on ExpenditureBalance {
    tokenAddress
    amount
  }
`;
export const Expenditure = gql`
  fragment Expenditure on Expenditure {
    id
    slots {
      ...ExpenditureSlot
    }
    motions {
      items {
        transactionHash
        action {
          type
        }
      }
    }
    balances {
      ...ExpenditureBalance
    }
    metadata {
      distributionType
    }
    status
    ownerAddress
    userStakeId
    createdAt
    firstEditTransactionHash
    splitPaymentPayoutClaimedNotificationSent
    type
    actions {
      items {
        type
        id
      }
    }
  }
  ${ExpenditureSlot}
  ${ExpenditureBalance}
`;
export const Extension = gql`
  fragment Extension on ColonyExtension {
    id
    hash
    colonyId
    isInitialized
    version
  }
`;
export const MotionStakes = gql`
  fragment MotionStakes on MotionStakes {
    raw {
      nay
      yay
    }
    percentage {
      nay
      yay
    }
  }
`;
export const UserMotionStakes = gql`
  fragment UserMotionStakes on UserMotionStakes {
    address
    stakes {
      raw {
        yay
        nay
      }
      percentage {
        yay
        nay
      }
    }
  }
`;
export const StakerReward = gql`
  fragment StakerReward on StakerRewards {
    address
    rewards {
      yay
      nay
    }
    isClaimed
  }
`;
export const VoterRecord = gql`
  fragment VoterRecord on VoterRecord {
    address
    voteCount
    vote
  }
`;
export const ColonyMotion = gql`
  fragment ColonyMotion on ColonyMotion {
    id
    nativeMotionId
    motionStakes {
      ...MotionStakes
    }
    requiredStake
    remainingStakes
    usersStakes {
      ...UserMotionStakes
    }
    userMinStake
    nativeMotionDomainId
    stakerRewards {
      ...StakerReward
    }
    isFinalized
    createdBy
    voterRecord {
      ...VoterRecord
    }
    revealedVotes {
      raw {
        yay
        nay
      }
      percentage {
        yay
        nay
      }
    }
    repSubmitted
    skillRep
    hasObjection
    motionDomainId
    nativeMotionDomainId
    motionStateHistory {
      hasVoted
      hasPassed
      hasFailed
      hasFailedNotFinalizable
      inRevealPhase
      yaySideFullyStakedAt
      naySideFullyStakedAt
      allVotesSubmittedAt
      allVotesRevealedAt
      endedAt
      finalizedAt
    }
    isDecision
    transactionHash
    expenditureId
  }
  ${MotionStakes}
  ${UserMotionStakes}
  ${StakerReward}
  ${VoterRecord}
`;
export const MultiSigUserSignature = gql`
  fragment MultiSigUserSignature on MultiSigUserSignature {
    id
    multiSigId
    role
    colonyAddress
    userAddress
    vote
    createdAt
  }
`;
export const ColonyMultiSig = gql`
  fragment ColonyMultiSig on ColonyMultiSig {
    id
    colonyAddress
    nativeMultiSigId
    multiSigDomainId
    nativeMultiSigDomainId
    requiredPermissions
    transactionHash
    isExecuted
    isRejected
    isDecision
    hasActionCompleted
    signatures {
      items {
        ...MultiSigUserSignature
      }
    }
    executedAt
    executedBy
    rejectedAt
    rejectedBy
    createdAt
    action {
      type
    }
  }
  executedAt
  executedBy
  rejectedAt
  rejectedBy
  createdAt
  action {
    type
  }
  expenditureId
}
    ${MultiSigUserSignature}`;
export const NotificationUser = gql`
  fragment NotificationUser on ColonyContributor {
    user {
      notificationsData {
        ...NotificationsData
      }
    }
  }
  ${NotificationsData}
`;
export const CreateColonyActionDocument = gql`
  mutation CreateColonyAction($input: CreateColonyActionInput!) {
    createColonyAction(input: $input) {
      id
    }
  }
`;
export const UpdateColonyActionDocument = gql`
  mutation UpdateColonyAction($input: UpdateColonyActionInput!) {
    updateColonyAction(input: $input) {
      id
    }
  }
`;
export const UpdateColonyDocument = gql`
  mutation UpdateColony($input: UpdateColonyInput!) {
    updateColony(input: $input) {
      id
    }
  }
`;
export const UpdateColonyMetadataDocument = gql`
  mutation UpdateColonyMetadata($input: UpdateColonyMetadataInput!) {
    updateColonyMetadata(input: $input) {
      id
    }
  }
`;
export const CreateColonyDocument = gql`
  mutation CreateColony(
    $input: CreateColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    createColony(input: $input, condition: $condition) {
      id
    }
  }
`;
export const CreateColonyMetadataDocument = gql`
  mutation CreateColonyMetadata($input: CreateColonyMetadataInput!) {
    createColonyMetadata(input: $input) {
      id
    }
  }
`;
export const DeleteColonyMetadataDocument = gql`
  mutation DeleteColonyMetadata($input: DeleteColonyMetadataInput!) {
    deleteColonyMetadata(input: $input) {
      id
    }
  }
`;
export const CreateColonyMemberInviteDocument = gql`
  mutation CreateColonyMemberInvite(
    $input: CreateColonyMemberInviteInput!
    $condition: ModelColonyMemberInviteConditionInput
  ) {
    createColonyMemberInvite(input: $input, condition: $condition) {
      id
    }
  }
`;
export const CreateColonyTokensDocument = gql`
  mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
    createColonyTokens(input: $input) {
      id
    }
  }
`;
export const CreateColonyContributorDocument = gql`
  mutation CreateColonyContributor($input: CreateColonyContributorInput!) {
    createColonyContributor(input: $input) {
      id
    }
  }
`;
export const UpdateColonyContributorDocument = gql`
  mutation UpdateColonyContributor($input: UpdateColonyContributorInput!) {
    updateColonyContributor(input: $input) {
      id
    }
  }
`;
export const DeleteColonyContributorDocument = gql`
  mutation DeleteColonyContributor($input: DeleteColonyContributorInput!) {
    deleteColonyContributor(input: $input) {
      id
    }
  }
`;
export const CreateCurrentVersionDocument = gql`
  mutation CreateCurrentVersion($input: CreateCurrentVersionInput!) {
    createCurrentVersion(input: $input) {
      id
    }
  }
`;
export const UpdateCurrentVersionDocument = gql`
  mutation UpdateCurrentVersion($input: UpdateCurrentVersionInput!) {
    updateCurrentVersion(input: $input) {
      id
    }
  }
`;
export const UpdateColonyDecisionDocument = gql`
  mutation UpdateColonyDecision($id: ID!, $showInDecisionsList: Boolean!) {
    updateColonyDecision(
      input: { id: $id, showInDecisionsList: $showInDecisionsList }
    ) {
      id
    }
  }
`;
export const CreateDomainDocument = gql`
  mutation CreateDomain($input: CreateDomainInput!) {
    createDomain(input: $input) {
      id
    }
  }
`;
export const CreateDomainMetadataDocument = gql`
  mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
    createDomainMetadata(input: $input) {
      id
    }
  }
`;
export const UpdateDomainMetadataDocument = gql`
  mutation UpdateDomainMetadata($input: UpdateDomainMetadataInput!) {
    updateDomainMetadata(input: $input) {
      id
    }
  }
`;
export const CreateContractEventDocument = gql`
  mutation CreateContractEvent(
    $input: CreateContractEventInput!
    $condition: ModelContractEventConditionInput
  ) {
    createContractEvent(input: $input, condition: $condition) {
      id
    }
  }
`;
export const CreateExpenditureDocument = gql`
  mutation CreateExpenditure($input: CreateExpenditureInput!) {
    createExpenditure(input: $input) {
      id
    }
  }
`;
export const UpdateExpenditureDocument = gql`
  mutation UpdateExpenditure($input: UpdateExpenditureInput!) {
    updateExpenditure(input: $input) {
      id
      ownerAddress
    }
  }
`;
export const UpdateExpenditureMetadataDocument = gql`
  mutation UpdateExpenditureMetadata($input: UpdateExpenditureMetadataInput!) {
    updateExpenditureMetadata(input: $input) {
      id
    }
  }
`;
export const CreateStreamingPaymentDocument = gql`
  mutation CreateStreamingPayment($input: CreateStreamingPaymentInput!) {
    createStreamingPayment(input: $input) {
      id
    }
  }
`;
export const UpdateStreamingPaymentDocument = gql`
  mutation UpdateStreamingPayment($input: UpdateStreamingPaymentInput!) {
    updateStreamingPayment(input: $input) {
      id
    }
  }
`;
export const CreateColonyExtensionDocument = gql`
  mutation CreateColonyExtension($input: CreateColonyExtensionInput!) {
    createColonyExtension(input: $input) {
      id
    }
  }
`;
export const UpdateColonyExtensionByAddressDocument = gql`
  mutation UpdateColonyExtensionByAddress($input: UpdateColonyExtensionInput!) {
    updateColonyExtension(input: $input) {
      id
      extensionHash: hash
      colonyAddress: colonyId
    }
  }
`;
export const CreateExtensionInstallationsCountDocument = gql`
  mutation CreateExtensionInstallationsCount(
    $input: CreateExtensionInstallationsCountInput!
  ) {
    createExtensionInstallationsCount(input: $input) {
      id
    }
  }
`;
export const UpdateExtensionInstallationsCountDocument = gql`
  mutation UpdateExtensionInstallationsCount(
    $input: UpdateExtensionInstallationsCountInput!
  ) {
    updateExtensionInstallationsCount(input: $input) {
      id
    }
  }
`;
export const CreateColonyFundsClaimDocument = gql`
  mutation CreateColonyFundsClaim(
    $input: CreateColonyFundsClaimInput!
    $condition: ModelColonyFundsClaimConditionInput
  ) {
    createColonyFundsClaim(input: $input, condition: $condition) {
      id
    }
  }
`;
export const UpdateColonyFundsClaimDocument = gql`
  mutation UpdateColonyFundsClaim(
    $input: UpdateColonyFundsClaimInput!
    $condition: ModelColonyFundsClaimConditionInput
  ) {
    updateColonyFundsClaim(input: $input, condition: $condition) {
      id
    }
  }
`;
export const DeleteColonyFundsClaimDocument = gql`
  mutation DeleteColonyFundsClaim(
    $input: DeleteColonyFundsClaimInput!
    $condition: ModelColonyFundsClaimConditionInput
  ) {
    deleteColonyFundsClaim(input: $input, condition: $condition) {
      id
    }
  }
`;
export const CreateCurrentNetworkInverseFeeDocument = gql`
  mutation CreateCurrentNetworkInverseFee(
    $input: CreateCurrentNetworkInverseFeeInput!
  ) {
    createCurrentNetworkInverseFee(input: $input) {
      id
    }
  }
`;
export const UpdateCurrentNetworkInverseFeeDocument = gql`
  mutation UpdateCurrentNetworkInverseFee(
    $input: UpdateCurrentNetworkInverseFeeInput!
  ) {
    updateCurrentNetworkInverseFee(input: $input) {
      id
    }
  }
`;
export const CreateColonyMotionDocument = gql`
  mutation CreateColonyMotion($input: CreateColonyMotionInput!) {
    createColonyMotion(input: $input) {
      id
    }
  }
`;
export const UpdateColonyMotionDocument = gql`
  mutation UpdateColonyMotion($input: UpdateColonyMotionInput!) {
    updateColonyMotion(input: $input) {
      id
    }
  }
`;
export const CreateMotionMessageDocument = gql`
  mutation CreateMotionMessage($input: CreateMotionMessageInput!) {
    createMotionMessage(input: $input) {
      id
    }
  }
`;
export const CreateUserVoterRewardDocument = gql`
  mutation CreateUserVoterReward($input: CreateVoterRewardsHistoryInput!) {
    createVoterRewardsHistory(input: $input) {
      id
    }
  }
`;
export const CreateColonyMultiSigDocument = gql`
  mutation CreateColonyMultiSig($input: CreateColonyMultiSigInput!) {
    createColonyMultiSig(input: $input) {
      id
    }
  }
`;
export const UpdateColonyMultiSigDocument = gql`
  mutation UpdateColonyMultiSig($input: UpdateColonyMultiSigInput!) {
    updateColonyMultiSig(input: $input) {
      id
    }
  }
`;
export const CreateMultiSigVoteDocument = gql`
  mutation CreateMultiSigVote($input: CreateMultiSigUserSignatureInput!) {
    createMultiSigUserSignature(input: $input) {
      id
    }
  }
`;
export const RemoveMultiSigVoteDocument = gql`
  mutation RemoveMultiSigVote($id: ID!) {
    deleteMultiSigUserSignature(input: { id: $id }) {
      id
    }
  }
`;
export const RemoveMultiSigRoleDocument = gql`
  mutation RemoveMultiSigRole($id: ID!) {
    deleteColonyRole(input: { id: $id }) {
      id
    }
  }
`;
export const CreateColonyRoleDocument = gql`
  mutation CreateColonyRole($input: CreateColonyRoleInput!) {
    createColonyRole(input: $input) {
      id
    }
  }
`;
export const UpdateColonyRoleDocument = gql`
  mutation UpdateColonyRole($input: UpdateColonyRoleInput!) {
    updateColonyRole(input: $input) {
      id
    }
  }
`;
export const CreateColonyHistoricRoleDocument = gql`
  mutation CreateColonyHistoricRole($input: CreateColonyHistoricRoleInput!) {
    createColonyHistoricRole(input: $input) {
      id
    }
  }
`;
export const CreateProxyColonyDocument = gql`
  mutation CreateProxyColony($input: CreateProxyColonyInput!) {
    createProxyColony(input: $input) {
      id
    }
  }
`;
export const UpdateReputationMiningCycleMetadataDocument = gql`
  mutation UpdateReputationMiningCycleMetadata(
    $input: UpdateReputationMiningCycleMetadataInput!
  ) {
    updateReputationMiningCycleMetadata(input: $input) {
      id
    }
  }
`;
export const CreateReputationMiningCycleMetadataDocument = gql`
  mutation CreateReputationMiningCycleMetadata(
    $input: CreateReputationMiningCycleMetadataInput!
  ) {
    createReputationMiningCycleMetadata(input: $input) {
      id
    }
  }
`;
export const CreateUserStakeDocument = gql`
  mutation CreateUserStake($input: CreateUserStakeInput!) {
    createUserStake(input: $input) {
      id
    }
  }
`;
export const UpdateUserStakeDocument = gql`
  mutation UpdateUserStake($input: UpdateUserStakeInput!) {
    updateUserStake(input: $input) {
      id
    }
  }
`;
export const CreateStatsDocument = gql`
  mutation CreateStats($value: String!) {
    createIngestorStats(input: { id: "STATS", value: $value }) {
      id
    }
  }
`;
export const UpdateStatsDocument = gql`
  mutation UpdateStats($value: String!) {
    updateIngestorStats(input: { id: "STATS", value: $value }) {
      id
    }
  }
`;
export const DeleteColonyTokensDocument = gql`
  mutation DeleteColonyTokens($input: DeleteColonyTokensInput!) {
    deleteColonyTokens(input: $input) {
      id
    }
  }
`;
export const GetColonyActionDocument = gql`
  query GetColonyAction($transactionHash: ID!) {
    getColonyAction(id: $transactionHash) {
      id
    }
  }
}
    `;
export const GetColonyArbitraryTransactionActionDocument = gql`
  query GetColonyArbitraryTransactionAction($transactionHash: ID!) {
    getColonyAction(id: $transactionHash) {
      id
      arbitraryTransactions {
        contractAddress
        encodedFunction
      }
    }
  }
`;
export const GetMotionIdFromActionDocument = gql`
  query GetMotionIdFromAction($id: ID!) {
    getColonyAction(id: $id) {
      motionData {
        id
      }
    }
  }
`;
export const GetActionIdFromAnnotationDocument = gql`
  query GetActionIdFromAnnotation($id: ID!) {
    getAnnotation(id: $id) {
      actionId
    }
  }
`;
export const GetActionByIdDocument = gql`
  query GetActionById($id: ID!) {
    getColonyAction(id: $id) {
      id
      type
      expenditureSlotChanges {
        oldSlots {
          ...ExpenditureSlot
        }
        newSlots {
          ...ExpenditureSlot
        }
      }
    }
  }
  ${ExpenditureSlot}
`;
export const GetColonyMetadataDocument = gql`
  query GetColonyMetadata($id: ID!) {
    getColonyMetadata(id: $id) {
      ...ColonyMetadata
      etherealData {
        colonyAvatar
        colonyDisplayName
        colonyName
        colonyThumbnail
        initiatorAddress
        tokenAvatar
        tokenThumbnail
      }
    }
  }
  ${ColonyMetadata}
`;
export const GetColonyDocument = gql`
  query GetColony($id: ID!, $nextToken: String) {
    getColony(id: $id) {
      ...Colony
    }
    getColonyByAddress(id: $id) {
      items {
        id
        name
      }
    }
    getColonyByType(type: METACOLONY) {
      items {
        id
        name
      }
    }
  }
  ${Colony}
`;
export const GetColonyByNameDocument = gql`
  query GetColonyByName($name: String!) {
    getColonyByName(name: $name) {
      items {
        id
        name
      }
    }
  }
`;
export const GetColonyByNativeTokenIdDocument = gql`
  query GetColonyByNativeTokenId(
    $nativeTokenId: ID!
    $limit: Int
    $nextToken: String
  ) {
    getColoniesByNativeTokenId(
      nativeTokenId: $nativeTokenId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        status {
          nativeToken {
            unlocked
            unlockable
            mintable
          }
          recovery
        }
      }
      nextToken
    }
  }
`;
export const ListColoniesDocument = gql`
  query ListColonies($nextToken: String) {
    listColonies(limit: 1000, nextToken: $nextToken) {
      nextToken
      items {
        id
        nativeTokenId
      }
    }
  }
`;
export const ListColoniesWithRootPermissionHoldersDocument = gql`
  query ListColoniesWithRootPermissionHolders($nextToken: String) {
    listColonies(limit: 1000, nextToken: $nextToken) {
      nextToken
      items {
        ...ColonyWithRootRoles
      }
    }
  }
  ${ColonyWithRootRoles}
`;
export const GetColonyContributorDocument = gql`
  query GetColonyContributor($id: ID!) {
    getColonyContributor(id: $id) {
      id
      isVerified
    }
  }
`;
export const GetColonyContributorsNotificationDataDocument = gql`
  query GetColonyContributorsNotificationData(
    $colonyAddress: ID!
    $sortDirection: ModelSortDirection = ASC
    $limit: Int = 100
    $nextToken: String
  ) {
    getContributorsByColony(
      colonyAddress: $colonyAddress
      sortDirection: $sortDirection
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        user {
          notificationsData {
            ...NotificationsData
          }
        }
      }
      nextToken
    }
  }
  ${NotificationsData}
`;
export const GetCurrentVersionDocument = gql`
  query GetCurrentVersion($key: String!) {
    getCurrentVersionByKey(key: $key) {
      items {
        id
        version
      }
    }
  }
`;
export const GetColonyDecisionByActionIdDocument = gql`
  query GetColonyDecisionByActionId($actionId: ID!) {
    getColonyDecisionByActionId(actionId: $actionId) {
      items {
        id
      }
    }
  }
`;
export const GetDomainMetadataDocument = gql`
  query GetDomainMetadata($id: ID!) {
    getDomainMetadata(id: $id) {
      color
      description
      id
      name
      changelog {
        newColor
        newDescription
        newName
        oldColor
        oldDescription
        oldName
        transactionHash
      }
    }
  }
`;
export const GetDomainByNativeSkillIdDocument = gql`
  query GetDomainByNativeSkillId($nativeSkillId: String!, $colonyAddress: ID!) {
    getDomainByNativeSkillId(
      nativeSkillId: $nativeSkillId
      filter: { colonyId: { eq: $colonyAddress } }
    ) {
      items {
        id
        nativeSkillId
        nativeId
      }
    }
  }
`;
export const GetDomainsByExtensionAddressDocument = gql`
  query GetDomainsByExtensionAddress($extensionAddress: ID!) {
    listColonyExtensions(filter: { id: { eq: $extensionAddress } }) {
      items {
        colony {
          domains {
            items {
              nativeSkillId
              nativeId
            }
          }
          id
        }
      }
    }
  }
`;
export const GetContractEventDocument = gql`
  query GetContractEvent($id: ID!) {
    getContractEvent(id: $id) {
      id
    }
  }
`;
export const GetExpenditureDocument = gql`
  query GetExpenditure($id: ID!) {
    getExpenditure(id: $id) {
      ...Expenditure
    }
  }
  ${Expenditure}
`;
export const GetExpenditureByNativeFundingPotIdAndColonyDocument = gql`
  query GetExpenditureByNativeFundingPotIdAndColony(
    $nativeFundingPotId: Int!
    $colonyAddress: ID!
  ) {
    getExpendituresByNativeFundingPotIdAndColony(
      nativeFundingPotId: $nativeFundingPotId
      colonyId: { eq: $colonyAddress }
    ) {
      items {
        ...Expenditure
      }
    }
  }
  ${Expenditure}
`;
export const GetStreamingPaymentDocument = gql`
  query GetStreamingPayment($id: ID!) {
    getStreamingPayment(id: $id) {
      id
      payouts {
        amount
        tokenAddress
        isClaimed
      }
    }
  }
`;
export const GetColonyExtensionDocument = gql`
  query GetColonyExtension($id: ID!) {
    getColonyExtension(id: $id) {
      ...Extension
    }
  }
  ${Extension}
`;
export const GetColonyExtensionsByColonyAddressDocument = gql`
  query GetColonyExtensionsByColonyAddress($colonyAddress: ID!) {
    getExtensionByColonyAndHash(colonyId: $colonyAddress) {
      items {
        ...Extension
      }
    }
  }
  ${Extension}
`;
export const ListExtensionsDocument = gql`
  query ListExtensions($hash: String!, $nextToken: String) {
    getExtensionsByHash(
      hash: $hash
      limit: 1000
      nextToken: $nextToken
      filter: { isDeleted: { eq: false } }
    ) {
      nextToken
      items {
        ...Extension
      }
    }
  }
  ${Extension}
`;
export const GetColonyExtensionByHashAndColonyDocument = gql`
  query GetColonyExtensionByHashAndColony(
    $colonyAddress: ID!
    $extensionHash: String!
  ) {
    getExtensionByColonyAndHash(
      colonyId: $colonyAddress
      hash: { eq: $extensionHash }
      filter: { isDeleted: { eq: false } }
    ) {
      items {
        id
      }
    }
  }
`;
export const GetExtensionInstallationsCountDocument = gql`
  query GetExtensionInstallationsCount($id: ID!) {
    getExtensionInstallationsCount(id: $id) {
      oneTxPayment
      stakedExpenditure
      stagedExpenditure
      streamingPayments
      reputationWeighted
      multiSigPermissions
    }
  }
`;
export const GetColonyExtensionByAddressDocument = gql`
  query GetColonyExtensionByAddress($extensionAddress: ID!) {
    getColonyExtension(id: $extensionAddress) {
      params {
        multiSig {
          colonyThreshold
          domainThresholds {
            domainId
            domainThreshold
          }
        }
      }
      colonyId
    }
  }
`;
export const GetColonyUnclaimedFundsDocument = gql`
  query GetColonyUnclaimedFunds(
    $colonyAddress: ID!
    $tokenAddress: ID!
    $upToBlock: Int = 1
  ) {
    listColonyFundsClaims(
      filter: {
        colonyFundsClaimsId: { eq: $colonyAddress }
        colonyFundsClaimTokenId: { eq: $tokenAddress }
        createdAtBlock: { le: $upToBlock }
        isClaimed: { ne: true }
      }
    ) {
      items {
        id
        token {
          ...Token
        }
        amount
      }
    }
  }
  ${Token}
`;
export const GetColonyUnclaimedFundDocument = gql`
  query GetColonyUnclaimedFund($claimId: ID!) {
    getColonyFundsClaim(id: $claimId) {
      id
    }
  }
`;
export const GetCurrentNetworkInverseFeeDocument = gql`
  query GetCurrentNetworkInverseFee {
    listCurrentNetworkInverseFees(limit: 1) {
      items {
        id
        inverseFee
      }
    }
  }
`;
export const GetColonyActionByMotionIdDocument = gql`
  query GetColonyActionByMotionId($motionId: ID!) {
    getColonyActionByMotionId(motionId: $motionId) {
      items {
        ...ActionMetadataInfo
      }
    }
  }
  ${ActionMetadataInfo}
`;
export const GetColonyMotionDocument = gql`
  query GetColonyMotion($id: ID!) {
    getColonyMotion(id: $id) {
      ...ColonyMotion
    }
  }
  ${ColonyMotion}
`;
export const GetVoterRewardsDocument = gql`
  query GetVoterRewards($input: GetVoterRewardsInput!) {
    getVoterRewards(input: $input) {
      min
      max
      reward
    }
  }
`;
export const GetColonyActionByMultiSigIdDocument = gql`
  query GetColonyActionByMultiSigId($multiSigId: ID!) {
    getColonyActionByMultiSigId(multiSigId: $multiSigId) {
      items {
        ...ActionMetadataInfo
      }
    }
  }
  ${ActionMetadataInfo}
`;
export const GetColonyMultiSigDocument = gql`
  query GetColonyMultiSig($id: ID!) {
    getColonyMultiSig(id: $id) {
      ...ColonyMultiSig
    }
  }
  ${ColonyMultiSig}
`;
export const GetUserMultiSigSignatureDocument = gql`
  query GetUserMultiSigSignature(
    $multiSigId: ID!
    $userAddress: ID!
    $vote: MultiSigVote!
    $role: Int!
  ) {
    getMultiSigUserSignatureByMultiSigId(
      filter: {
        userAddress: { eq: $userAddress }
        vote: { eq: $vote }
        role: { eq: $role }
      }
      multiSigId: $multiSigId
    ) {
      items {
        ...MultiSigUserSignature
      }
    }
  }
  ${MultiSigUserSignature}
`;
export const GetAllMultiSigRolesDocument = gql`
  query GetAllMultiSigRoles($colonyAddress: ID!) {
    getRoleByColony(
      colonyAddress: $colonyAddress
      limit: 9999
      filter: { isMultiSig: { eq: true } }
    ) {
      items {
        id
      }
    }
  }
`;
export const GetActiveColonyMultisigsDocument = gql`
  query GetActiveColonyMultisigs($colonyAddress: ID!) {
    getMultiSigByColonyAddress(
      colonyAddress: $colonyAddress
      filter: { isExecuted: { eq: false }, isRejected: { eq: false } }
      limit: 9999
    ) {
      items {
        id
      }
    }
  }
`;
export const GetColonyRoleDocument = gql`
  query GetColonyRole($id: ID!) {
    getColonyRole(id: $id) {
      id
      latestBlock
      role_0
      role_1
      role_2
      role_3
      role_5
      role_6
    }
  }
`;
export const GetAllColonyRolesDocument = gql`
  query GetAllColonyRoles($targetAddress: ID!, $colonyAddress: ID!) {
    getRoleByTargetAddressAndColony(
      targetAddress: $targetAddress
      colonyAddress: { eq: $colonyAddress }
    ) {
      items {
        id
        role_0
        role_1
        role_2
        role_3
        role_5
        role_6
      }
    }
  }
`;
export const GetColonyHistoricRoleDocument = gql`
  query GetColonyHistoricRole($id: ID!) {
    getColonyHistoricRole(id: $id) {
      id
    }
  }
`;
export const GetReputationMiningCycleMetadataDocument = gql`
  query GetReputationMiningCycleMetadata($id: ID!) {
    getReputationMiningCycleMetadata(id: $id) {
      id
    }
  }
`;
export const GetSafeTransactionByTransactionHashDocument = gql`
  query GetSafeTransactionByTransactionHash($transactionHash: ID!) {
    getSafeTransaction(id: $transactionHash) {
      id
    }
  }
`;
export const GetUserStakeDocument = gql`
  query GetUserStake($id: ID!) {
    getUserStake(id: $id) {
      id
      amount
    }
  }
`;
export const GetStatsDocument = gql`
  query GetStats {
    getIngestorStats(id: "STATS") {
      value
    }
  }
`;
export const GetTokenFromEverywhereDocument = gql`
  query GetTokenFromEverywhere($input: TokenFromEverywhereArguments!) {
    getTokenFromEverywhere(input: $input) {
      items {
        id
      }
    }
  }
`;
export const GetNotificationUsersDocument = gql`
  query GetNotificationUsers($filter: ModelUserFilterInput, $limit: Int) {
    listUsers(filter: $filter, limit: $limit) {
      items {
        notificationsData {
          ...NotificationsData
        }
      }
    }
  }
  ${NotificationsData}
`;
