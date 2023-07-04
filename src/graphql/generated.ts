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
  AWSDateTime: any;
  AWSEmail: any;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: any;
  AWSURL: any;
};

export type ChainMetadata = {
  __typename?: 'ChainMetadata';
  blockNumber?: Maybe<Scalars['Int']>;
  chainId: Scalars['Int'];
  logIndex?: Maybe<Scalars['Int']>;
  network?: Maybe<Network>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type ChainMetadataInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  chainId: Scalars['Int'];
  logIndex?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
  transactionHash?: InputMaybe<Scalars['String']>;
};

export type Colony = {
  __typename?: 'Colony';
  actions?: Maybe<ModelColonyActionConnection>;
  balances?: Maybe<ColonyBalances>;
  chainFundsClaim?: Maybe<ColonyChainFundsClaim>;
  chainMetadata: ChainMetadata;
  createdAt: Scalars['AWSDateTime'];
  domains?: Maybe<ModelDomainConnection>;
  extensions?: Maybe<ModelColonyExtensionConnection>;
  fundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  id: Scalars['ID'];
  metadata?: Maybe<ColonyMetadata>;
  motionsWithUnclaimedStakes?: Maybe<Array<ColonyUnclaimedStake>>;
  name: Scalars['String'];
  nativeToken: Token;
  nativeTokenId: Scalars['ID'];
  roles?: Maybe<ModelColonyRoleConnection>;
  status?: Maybe<ColonyStatus>;
  tokens?: Maybe<ModelColonyTokensConnection>;
  type?: Maybe<ColonyType>;
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
  watchers?: Maybe<ModelWatchedColoniesConnection>;
};

export type ColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyWatchersArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyAction = {
  __typename?: 'ColonyAction';
  amount?: Maybe<Scalars['String']>;
  blockNumber: Scalars['Int'];
  colony: Colony;
  colonyActionsId?: Maybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  fromDomain?: Maybe<Domain>;
  fromDomainId?: Maybe<Scalars['ID']>;
  fundamentalChainId?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  individualEvents?: Maybe<Scalars['String']>;
  initiatorAddress: Scalars['ID'];
  initiatorColony?: Maybe<Colony>;
  initiatorExtension?: Maybe<ColonyExtension>;
  initiatorToken?: Maybe<Token>;
  initiatorUser?: Maybe<User>;
  isMotion?: Maybe<Scalars['Boolean']>;
  motionData?: Maybe<ColonyMotion>;
  motionDomainId?: Maybe<Scalars['Int']>;
  motionId?: Maybe<Scalars['ID']>;
  newColonyVersion?: Maybe<Scalars['Int']>;
  pendingColonyMetadata?: Maybe<ColonyMetadata>;
  pendingColonyMetadataId?: Maybe<Scalars['ID']>;
  pendingDomainMetadata?: Maybe<DomainMetadata>;
  pendingDomainMetadataId?: Maybe<Scalars['ID']>;
  recipientAddress?: Maybe<Scalars['ID']>;
  recipientColony?: Maybe<Colony>;
  recipientExtension?: Maybe<ColonyExtension>;
  recipientToken?: Maybe<Token>;
  recipientUser?: Maybe<User>;
  roles?: Maybe<ColonyActionRoles>;
  showInActionsList: Scalars['Boolean'];
  toDomain?: Maybe<Domain>;
  toDomainId?: Maybe<Scalars['ID']>;
  token?: Maybe<Token>;
  tokenAddress?: Maybe<Scalars['ID']>;
  type: ColonyActionType;
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyActionRoles = {
  __typename?: 'ColonyActionRoles';
  role_0?: Maybe<Scalars['Boolean']>;
  role_1?: Maybe<Scalars['Boolean']>;
  role_2?: Maybe<Scalars['Boolean']>;
  role_3?: Maybe<Scalars['Boolean']>;
  role_5?: Maybe<Scalars['Boolean']>;
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

export enum ColonyActionType {
  ColonyEdit = 'COLONY_EDIT',
  ColonyEditMotion = 'COLONY_EDIT_MOTION',
  CreateDomain = 'CREATE_DOMAIN',
  CreateDomainMotion = 'CREATE_DOMAIN_MOTION',
  EditDomain = 'EDIT_DOMAIN',
  EditDomainMotion = 'EDIT_DOMAIN_MOTION',
  EmitDomainReputationPenalty = 'EMIT_DOMAIN_REPUTATION_PENALTY',
  EmitDomainReputationPenaltyMotion = 'EMIT_DOMAIN_REPUTATION_PENALTY_MOTION',
  EmitDomainReputationReward = 'EMIT_DOMAIN_REPUTATION_REWARD',
  EmitDomainReputationRewardMotion = 'EMIT_DOMAIN_REPUTATION_REWARD_MOTION',
  Generic = 'GENERIC',
  MintTokens = 'MINT_TOKENS',
  MintTokensMotion = 'MINT_TOKENS_MOTION',
  MoveFunds = 'MOVE_FUNDS',
  MoveFundsMotion = 'MOVE_FUNDS_MOTION',
  NullMotion = 'NULL_MOTION',
  Payment = 'PAYMENT',
  PaymentMotion = 'PAYMENT_MOTION',
  Recovery = 'RECOVERY',
  SetUserRoles = 'SET_USER_ROLES',
  SetUserRolesMotion = 'SET_USER_ROLES_MOTION',
  UnlockToken = 'UNLOCK_TOKEN',
  UnlockTokenMotion = 'UNLOCK_TOKEN_MOTION',
  VersionUpgrade = 'VERSION_UPGRADE',
  VersionUpgradeMotion = 'VERSION_UPGRADE_MOTION',
  WrongColony = 'WRONG_COLONY',
}

export type ColonyBalance = {
  __typename?: 'ColonyBalance';
  balance: Scalars['String'];
  domain?: Maybe<Domain>;
  id: Scalars['ID'];
  token: Token;
};

export type ColonyBalanceInput = {
  balance: Scalars['String'];
  domain?: InputMaybe<DomainInput>;
  id?: InputMaybe<Scalars['ID']>;
  token: TokenInput;
};

export type ColonyBalances = {
  __typename?: 'ColonyBalances';
  items?: Maybe<Array<Maybe<ColonyBalance>>>;
};

export type ColonyBalancesInput = {
  items?: InputMaybe<Array<InputMaybe<ColonyBalanceInput>>>;
};

export type ColonyChainFundsClaim = {
  __typename?: 'ColonyChainFundsClaim';
  amount: Scalars['String'];
  createdAt: Scalars['AWSDateTime'];
  createdAtBlock: Scalars['Int'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyChainFundsClaimInput = {
  amount: Scalars['String'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
};

export type ColonyExtension = {
  __typename?: 'ColonyExtension';
  colony: Colony;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  installedAt: Scalars['AWSTimestamp'];
  installedBy: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  isDeprecated: Scalars['Boolean'];
  isInitialized: Scalars['Boolean'];
  params?: Maybe<ExtensionParams>;
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
};

export type ColonyFundsClaim = {
  __typename?: 'ColonyFundsClaim';
  amount: Scalars['String'];
  colonyFundsClaimTokenId: Scalars['ID'];
  colonyFundsClaimsId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  createdAtBlock: Scalars['Int'];
  id: Scalars['ID'];
  token: Token;
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyHistoricRole = {
  __typename?: 'ColonyHistoricRole';
  blockNumber: Scalars['Int'];
  colony: Colony;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  domain: Domain;
  domainId: Scalars['ID'];
  id: Scalars['ID'];
  role_0?: Maybe<Scalars['Boolean']>;
  role_1?: Maybe<Scalars['Boolean']>;
  role_2?: Maybe<Scalars['Boolean']>;
  role_3?: Maybe<Scalars['Boolean']>;
  role_5?: Maybe<Scalars['Boolean']>;
  role_6?: Maybe<Scalars['Boolean']>;
  targetAddress?: Maybe<Scalars['ID']>;
  targetColony?: Maybe<Colony>;
  targetExtension?: Maybe<ColonyExtension>;
  targetToken?: Maybe<Token>;
  targetUser?: Maybe<User>;
  type: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyId = {
  __typename?: 'ColonyID';
  id: Scalars['ID'];
};

export type ColonyMetadata = {
  __typename?: 'ColonyMetadata';
  avatar?: Maybe<Scalars['String']>;
  changelog?: Maybe<Array<ColonyMetadataChangelog>>;
  createdAt: Scalars['AWSDateTime'];
  displayName: Scalars['String'];
  id: Scalars['ID'];
  isWhitelistActivated?: Maybe<Scalars['Boolean']>;
  modifiedTokenAddresses?: Maybe<PendingModifiedTokenAddresses>;
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  whitelistedAddresses?: Maybe<Array<Scalars['String']>>;
};

export type ColonyMetadataChangelog = {
  __typename?: 'ColonyMetadataChangelog';
  hasAvatarChanged: Scalars['Boolean'];
  hasWhitelistChanged: Scalars['Boolean'];
  haveTokensChanged: Scalars['Boolean'];
  newDisplayName: Scalars['String'];
  oldDisplayName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type ColonyMetadataChangelogInput = {
  hasAvatarChanged: Scalars['Boolean'];
  hasWhitelistChanged: Scalars['Boolean'];
  haveTokensChanged: Scalars['Boolean'];
  newDisplayName: Scalars['String'];
  oldDisplayName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type ColonyMotion = {
  __typename?: 'ColonyMotion';
  createdAt: Scalars['AWSDateTime'];
  createdBy: Scalars['String'];
  hasObjection: Scalars['Boolean'];
  id: Scalars['ID'];
  isFinalized: Scalars['Boolean'];
  messages?: Maybe<ModelMotionMessageConnection>;
  motionDomain: Domain;
  motionDomainId: Scalars['ID'];
  motionStakes: MotionStakes;
  motionStateHistory: MotionStateHistory;
  nativeMotionDomainId: Scalars['String'];
  nativeMotionId: Scalars['String'];
  remainingStakes: Array<Scalars['String']>;
  repSubmitted: Scalars['String'];
  requiredStake: Scalars['String'];
  revealedVotes: MotionStakes;
  rootHash: Scalars['String'];
  skillRep: Scalars['String'];
  stakerRewards: Array<StakerRewards>;
  updatedAt: Scalars['AWSDateTime'];
  userMinStake: Scalars['String'];
  usersStakes: Array<UserStakes>;
  voterRecord: Array<VoterRecord>;
};

export type ColonyMotionMessagesArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyRole = {
  __typename?: 'ColonyRole';
  colonyRolesId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  domain: Domain;
  domainId: Scalars['ID'];
  id: Scalars['ID'];
  latestBlock: Scalars['Int'];
  role_0?: Maybe<Scalars['Boolean']>;
  role_1?: Maybe<Scalars['Boolean']>;
  role_2?: Maybe<Scalars['Boolean']>;
  role_3?: Maybe<Scalars['Boolean']>;
  role_5?: Maybe<Scalars['Boolean']>;
  role_6?: Maybe<Scalars['Boolean']>;
  targetAddress?: Maybe<Scalars['ID']>;
  targetColony?: Maybe<Colony>;
  targetExtension?: Maybe<ColonyExtension>;
  targetToken?: Maybe<Token>;
  targetUser?: Maybe<User>;
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyStake = {
  __typename?: 'ColonyStake';
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  totalAmount: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  userId: Scalars['ID'];
};

export type ColonyStatus = {
  __typename?: 'ColonyStatus';
  nativeToken?: Maybe<NativeTokenStatus>;
  recovery?: Maybe<Scalars['Boolean']>;
};

export type ColonyStatusInput = {
  nativeToken?: InputMaybe<NativeTokenStatusInput>;
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

export enum ColonyType {
  Colony = 'COLONY',
  Metacolony = 'METACOLONY',
}

export type ColonyUnclaimedStake = {
  __typename?: 'ColonyUnclaimedStake';
  motionId: Scalars['String'];
  unclaimedRewards: Array<StakerRewards>;
};

export type ColonyUnclaimedStakeInput = {
  motionId: Scalars['String'];
  unclaimedRewards: Array<StakerRewardsInput>;
};

export type ContractEvent = {
  __typename?: 'ContractEvent';
  agent: Scalars['String'];
  chainMetadata: ChainMetadata;
  colony?: Maybe<Colony>;
  contractEventColonyId?: Maybe<Scalars['ID']>;
  contractEventDomainId?: Maybe<Scalars['ID']>;
  contractEventTokenId?: Maybe<Scalars['ID']>;
  contractEventUserId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  domain?: Maybe<Domain>;
  encodedArguments?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  signature: Scalars['String'];
  target: Scalars['String'];
  token?: Maybe<Token>;
  updatedAt: Scalars['AWSDateTime'];
  user?: Maybe<User>;
};

export type Contributor = {
  __typename?: 'Contributor';
  address: Scalars['String'];
  reputationAmount?: Maybe<Scalars['String']>;
  reputationPercentage?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CreateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  blockNumber: Scalars['Int'];
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fundamentalChainId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  individualEvents?: InputMaybe<Scalars['String']>;
  initiatorAddress: Scalars['ID'];
  isMotion?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['Int']>;
  motionId?: InputMaybe<Scalars['ID']>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  roles?: InputMaybe<ColonyActionRolesInput>;
  showInActionsList: Scalars['Boolean'];
  toDomainId?: InputMaybe<Scalars['ID']>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  type: ColonyActionType;
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
};

export type CreateColonyHistoricRoleInput = {
  blockNumber: Scalars['Int'];
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
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
  id?: InputMaybe<Scalars['ID']>;
  motionsWithUnclaimedStakes?: InputMaybe<Array<ColonyUnclaimedStakeInput>>;
  name: Scalars['String'];
  nativeTokenId: Scalars['ID'];
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateColonyMetadataInput = {
  avatar?: InputMaybe<Scalars['String']>;
  changelog?: InputMaybe<Array<ColonyMetadataChangelogInput>>;
  displayName: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  isWhitelistActivated?: InputMaybe<Scalars['Boolean']>;
  modifiedTokenAddresses?: InputMaybe<PendingModifiedTokenAddressesInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  whitelistedAddresses?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateColonyMotionInput = {
  createdBy: Scalars['String'];
  hasObjection: Scalars['Boolean'];
  id?: InputMaybe<Scalars['ID']>;
  isFinalized: Scalars['Boolean'];
  motionDomainId: Scalars['ID'];
  motionStakes: MotionStakesInput;
  motionStateHistory: MotionStateHistoryInput;
  nativeMotionDomainId: Scalars['String'];
  nativeMotionId: Scalars['String'];
  remainingStakes: Array<Scalars['String']>;
  repSubmitted: Scalars['String'];
  requiredStake: Scalars['String'];
  revealedVotes: MotionStakesInput;
  rootHash: Scalars['String'];
  skillRep: Scalars['String'];
  stakerRewards: Array<StakerRewardsInput>;
  userMinStake: Scalars['String'];
  usersStakes: Array<UserStakesInput>;
  voterRecord: Array<VoterRecordInput>;
};

export type CreateColonyRoleInput = {
  colonyRolesId?: InputMaybe<Scalars['ID']>;
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  latestBlock: Scalars['Int'];
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
};

export type CreateColonyStakeInput = {
  colonyId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  totalAmount: Scalars['String'];
  userId: Scalars['ID'];
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
  nativeSkillId: Scalars['Int'];
};

export type CreateDomainMetadataInput = {
  changelog?: InputMaybe<Array<DomainMetadataChangelogInput>>;
  color: DomainColor;
  description: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type CreateIngestorStatsInput = {
  id?: InputMaybe<Scalars['ID']>;
  value: Scalars['String'];
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

export type CreateProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['ID']>;
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
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
};

export type CreateUniqueColonyInput = {
  chainMetadata: ChainMetadataInput;
  colonyNativeTokenId: Scalars['ID'];
  id: Scalars['ID'];
  name: Scalars['String'];
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateUniqueUserInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  profile?: InputMaybe<ProfileInput>;
};

export type CreateUserInput = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  profileId?: InputMaybe<Scalars['ID']>;
};

export type CreateUserTokensInput = {
  id?: InputMaybe<Scalars['ID']>;
  tokenID: Scalars['ID'];
  userID: Scalars['ID'];
};

export type CreateWatchedColoniesInput = {
  colonyID: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  userID: Scalars['ID'];
};

export type CurrentNetworkInverseFee = {
  __typename?: 'CurrentNetworkInverseFee';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  inverseFee: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

export type CurrentVersion = {
  __typename?: 'CurrentVersion';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  key: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
};

export type DeleteColonyActionInput = {
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

export type DeleteColonyMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMotionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyRoleInput = {
  id: Scalars['ID'];
};

export type DeleteColonyStakeInput = {
  id: Scalars['ID'];
};

export type DeleteColonyTokensInput = {
  id: Scalars['ID'];
};

export type DeleteContractEventInput = {
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

export type DeleteIngestorStatsInput = {
  id: Scalars['ID'];
};

export type DeleteMotionMessageInput = {
  id: Scalars['ID'];
};

export type DeleteProfileInput = {
  id: Scalars['ID'];
};

export type DeleteTokenInput = {
  id: Scalars['ID'];
};

export type DeleteUserInput = {
  id: Scalars['ID'];
};

export type DeleteUserTokensInput = {
  id: Scalars['ID'];
};

export type DeleteWatchedColoniesInput = {
  id: Scalars['ID'];
};

export type Domain = {
  __typename?: 'Domain';
  colony: Colony;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  isRoot: Scalars['Boolean'];
  metadata?: Maybe<DomainMetadata>;
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  nativeSkillId: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
};

export enum DomainColor {
  Aqua = 'AQUA',
  Black = 'BLACK',
  Blue = 'BLUE',
  BlueGrey = 'BLUE_GREY',
  EmeraldGreen = 'EMERALD_GREEN',
  Gold = 'GOLD',
  Green = 'GREEN',
  LightPink = 'LIGHT_PINK',
  Magenta = 'MAGENTA',
  Orange = 'ORANGE',
  Periwinkle = 'PERIWINKLE',
  Pink = 'PINK',
  Purple = 'PURPLE',
  PurpleGrey = 'PURPLE_GREY',
  Red = 'RED',
  Yellow = 'YELLOW',
}

export type DomainInput = {
  id: Scalars['ID'];
};

export type DomainMetadata = {
  __typename?: 'DomainMetadata';
  changelog?: Maybe<Array<DomainMetadataChangelog>>;
  color: DomainColor;
  createdAt: Scalars['AWSDateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

export type DomainMetadataChangelog = {
  __typename?: 'DomainMetadataChangelog';
  newColor: DomainColor;
  newDescription: Scalars['String'];
  newName: Scalars['String'];
  oldColor: DomainColor;
  oldDescription: Scalars['String'];
  oldName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type DomainMetadataChangelogInput = {
  newColor: DomainColor;
  newDescription: Scalars['String'];
  newName: Scalars['String'];
  oldColor: DomainColor;
  oldDescription: Scalars['String'];
  oldName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export enum EmailPermissions {
  IsHuman = 'isHuman',
  SendNotifications = 'sendNotifications',
}

export type ExtensionParams = {
  __typename?: 'ExtensionParams';
  votingReputation?: Maybe<VotingReputationParams>;
};

export type ExtensionParamsInput = {
  votingReputation?: InputMaybe<VotingReputationParamsInput>;
};

export type GetMotionStateInput = {
  colonyAddress: Scalars['String'];
  databaseMotionId: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type GetMotionTimeoutPeriodsInput = {
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
};

export type GetMotionTimeoutPeriodsReturn = {
  __typename?: 'GetMotionTimeoutPeriodsReturn';
  timeLeftToEscalate: Scalars['String'];
  timeLeftToReveal: Scalars['String'];
  timeLeftToStake: Scalars['String'];
  timeLeftToVote: Scalars['String'];
};

export type GetReputationForTopDomainsInput = {
  colonyAddress: Scalars['String'];
  rootHash?: InputMaybe<Scalars['String']>;
  walletAddress: Scalars['String'];
};

export type GetReputationForTopDomainsReturn = {
  __typename?: 'GetReputationForTopDomainsReturn';
  items?: Maybe<Array<UserDomainReputation>>;
};

export type GetUserReputationInput = {
  colonyAddress: Scalars['String'];
  domainId?: InputMaybe<Scalars['Int']>;
  rootHash?: InputMaybe<Scalars['String']>;
  walletAddress: Scalars['String'];
};

export type GetUserTokenBalanceInput = {
  colonyAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
  walletAddress: Scalars['String'];
};

export type GetUserTokenBalanceReturn = {
  __typename?: 'GetUserTokenBalanceReturn';
  activeBalance?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['String']>;
  inactiveBalance?: Maybe<Scalars['String']>;
  lockedBalance?: Maybe<Scalars['String']>;
  pendingBalance?: Maybe<Scalars['String']>;
};

export type GetVoterRewardsInput = {
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
  nativeMotionDomainId: Scalars['String'];
  rootHash: Scalars['String'];
  voterAddress: Scalars['String'];
};

export type IngestorStats = {
  __typename?: 'IngestorStats';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  value: Scalars['String'];
};

export type MembersForColonyInput = {
  colonyAddress: Scalars['String'];
  domainId?: InputMaybe<Scalars['Int']>;
  rootHash?: InputMaybe<Scalars['String']>;
  sortingMethod?: InputMaybe<SortingMethod>;
};

export type MembersForColonyReturn = {
  __typename?: 'MembersForColonyReturn';
  contributors?: Maybe<Array<Contributor>>;
  watchers?: Maybe<Array<Watcher>>;
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

export type ModelColonyActionConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionConditionInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fundamentalChainId?: InputMaybe<ModelIntInput>;
  individualEvents?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  motionId?: InputMaybe<ModelIdInput>;
  newColonyVersion?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyActionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionConditionInput>>>;
  pendingColonyMetadataId?: InputMaybe<ModelIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelIdInput>;
  recipientAddress?: InputMaybe<ModelIdInput>;
  showInActionsList?: InputMaybe<ModelBooleanInput>;
  toDomainId?: InputMaybe<ModelIdInput>;
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
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fundamentalChainId?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  individualEvents?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  motionId?: InputMaybe<ModelIdInput>;
  newColonyVersion?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyActionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionFilterInput>>>;
  pendingColonyMetadataId?: InputMaybe<ModelIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelIdInput>;
  recipientAddress?: InputMaybe<ModelIdInput>;
  showInActionsList?: InputMaybe<ModelBooleanInput>;
  toDomainId?: InputMaybe<ModelIdInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelColonyActionTypeInput>;
};

export type ModelColonyActionTypeInput = {
  eq?: InputMaybe<ColonyActionType>;
  ne?: InputMaybe<ColonyActionType>;
};

export type ModelColonyConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyConditionInput>>>;
  name?: InputMaybe<ModelStringInput>;
  nativeTokenId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyConditionInput>>>;
  type?: InputMaybe<ModelColonyTypeInput>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyConnection = {
  __typename?: 'ModelColonyConnection';
  items: Array<Maybe<Colony>>;
  nextToken?: Maybe<Scalars['String']>;
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
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  nativeTokenId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFilterInput>>>;
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
  not?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimFilterInput>>>;
};

export type ModelColonyHistoricRoleConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleConditionInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelIdInput>;
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

export type ModelColonyMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMetadataConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  isWhitelistActivated?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMetadataConditionInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  whitelistedAddresses?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMetadataConnection = {
  __typename?: 'ModelColonyMetadataConnection';
  items: Array<Maybe<ColonyMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMetadataFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  isWhitelistActivated?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMetadataFilterInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  whitelistedAddresses?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMotionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMotionConditionInput>>>;
  createdBy?: InputMaybe<ModelStringInput>;
  hasObjection?: InputMaybe<ModelBooleanInput>;
  isFinalized?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelStringInput>;
  nativeMotionId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMotionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMotionConditionInput>>>;
  remainingStakes?: InputMaybe<ModelStringInput>;
  repSubmitted?: InputMaybe<ModelStringInput>;
  requiredStake?: InputMaybe<ModelStringInput>;
  rootHash?: InputMaybe<ModelStringInput>;
  skillRep?: InputMaybe<ModelStringInput>;
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
  hasObjection?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  isFinalized?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelStringInput>;
  nativeMotionId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMotionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMotionFilterInput>>>;
  remainingStakes?: InputMaybe<ModelStringInput>;
  repSubmitted?: InputMaybe<ModelStringInput>;
  requiredStake?: InputMaybe<ModelStringInput>;
  rootHash?: InputMaybe<ModelStringInput>;
  skillRep?: InputMaybe<ModelStringInput>;
  userMinStake?: InputMaybe<ModelStringInput>;
};

export type ModelColonyRoleConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyRoleConditionInput>>>;
  colonyRolesId?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
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
  colonyRolesId?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
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

export type ModelColonyStakeConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyStakeConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyStakeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyStakeConditionInput>>>;
  totalAmount?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelColonyStakeConnection = {
  __typename?: 'ModelColonyStakeConnection';
  items: Array<Maybe<ColonyStake>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyStakeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyStakeFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyStakeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyStakeFilterInput>>>;
  totalAmount?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
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
  nativeSkillId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelDomainConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainConditionInput>>>;
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
  nativeSkillId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelDomainFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainFilterInput>>>;
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

export type ModelProfileConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProfileConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  bio?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  location?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProfileConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProfileConditionInput>>>;
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
  email?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  location?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProfileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProfileFilterInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  website?: InputMaybe<ModelStringInput>;
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

export type ModelSubscriptionBooleanInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export type ModelSubscriptionColonyActionFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  fromDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  fundamentalChainId?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  individualEvents?: InputMaybe<ModelSubscriptionStringInput>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  isMotion?: InputMaybe<ModelSubscriptionBooleanInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIntInput>;
  motionId?: InputMaybe<ModelSubscriptionIdInput>;
  newColonyVersion?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  pendingColonyMetadataId?: InputMaybe<ModelSubscriptionIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelSubscriptionIdInput>;
  recipientAddress?: InputMaybe<ModelSubscriptionIdInput>;
  showInActionsList?: InputMaybe<ModelSubscriptionBooleanInput>;
  toDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  tokenAddress?: InputMaybe<ModelSubscriptionIdInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
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
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  nativeTokenId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFilterInput>>>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionColonyFundsClaimFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>>
  >;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  createdAtBlock?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
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

export type ModelSubscriptionColonyMetadataFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMetadataFilterInput>>
  >;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  displayName?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isWhitelistActivated?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionColonyMetadataFilterInput>>
  >;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  whitelistedAddresses?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyMotionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMotionFilterInput>>>;
  createdBy?: InputMaybe<ModelSubscriptionStringInput>;
  hasObjection?: InputMaybe<ModelSubscriptionBooleanInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isFinalized?: InputMaybe<ModelSubscriptionBooleanInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelSubscriptionStringInput>;
  nativeMotionId?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMotionFilterInput>>>;
  remainingStakes?: InputMaybe<ModelSubscriptionStringInput>;
  repSubmitted?: InputMaybe<ModelSubscriptionStringInput>;
  requiredStake?: InputMaybe<ModelSubscriptionStringInput>;
  rootHash?: InputMaybe<ModelSubscriptionStringInput>;
  skillRep?: InputMaybe<ModelSubscriptionStringInput>;
  userMinStake?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyRoleFilterInput>>>;
  domainId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
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

export type ModelSubscriptionColonyStakeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyStakeFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyStakeFilterInput>>>;
  totalAmount?: InputMaybe<ModelSubscriptionStringInput>;
  userId?: InputMaybe<ModelSubscriptionIdInput>;
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
  nativeSkillId?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
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

export type ModelSubscriptionProfileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionProfileFilterInput>>>;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  bio?: InputMaybe<ModelSubscriptionStringInput>;
  displayName?: InputMaybe<ModelSubscriptionStringInput>;
  email?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  location?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionProfileFilterInput>>>;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  website?: InputMaybe<ModelSubscriptionStringInput>;
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
};

export type ModelSubscriptionUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  profileId?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionUserTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserTokensFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelSubscriptionIdInput>;
  userID?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionWatchedColoniesFilterInput = {
  and?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>>
  >;
  colonyID?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<
    Array<InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>>
  >;
  userID?: InputMaybe<ModelSubscriptionIdInput>;
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
};

export type ModelTokenConnection = {
  __typename?: 'ModelTokenConnection';
  items: Array<Maybe<Token>>;
  nextToken?: Maybe<Scalars['String']>;
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
};

export type ModelTokenTypeInput = {
  eq?: InputMaybe<TokenType>;
  ne?: InputMaybe<TokenType>;
};

export type ModelUserConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  profileId?: InputMaybe<ModelIdInput>;
};

export type ModelUserConnection = {
  __typename?: 'ModelUserConnection';
  items: Array<Maybe<User>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  profileId?: InputMaybe<ModelIdInput>;
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

export type ModelWatchedColoniesConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesConditionInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelWatchedColoniesConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesConditionInput>>>;
  userID?: InputMaybe<ModelIdInput>;
};

export type ModelWatchedColoniesConnection = {
  __typename?: 'ModelWatchedColoniesConnection';
  items: Array<Maybe<WatchedColonies>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelWatchedColoniesFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesFilterInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelWatchedColoniesFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesFilterInput>>>;
  userID?: InputMaybe<ModelIdInput>;
};

export type MotionMessage = {
  __typename?: 'MotionMessage';
  amount?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  initiatorAddress: Scalars['ID'];
  initiatorUser?: Maybe<User>;
  messageKey: Scalars['String'];
  motionId: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  vote?: Maybe<Scalars['String']>;
};

export type MotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  initiatorAddress: Scalars['String'];
  messageKey: Scalars['String'];
  name: Scalars['String'];
  vote?: InputMaybe<Scalars['String']>;
};

export type MotionStakeValues = {
  __typename?: 'MotionStakeValues';
  nay: Scalars['String'];
  yay: Scalars['String'];
};

export type MotionStakeValuesInput = {
  nay: Scalars['String'];
  yay: Scalars['String'];
};

export type MotionStakes = {
  __typename?: 'MotionStakes';
  percentage: MotionStakeValues;
  raw: MotionStakeValues;
};

export type MotionStakesInput = {
  percentage: MotionStakeValuesInput;
  raw: MotionStakeValuesInput;
};

export type MotionStateHistory = {
  __typename?: 'MotionStateHistory';
  hasFailed: Scalars['Boolean'];
  hasFailedNotFinalizable: Scalars['Boolean'];
  hasPassed: Scalars['Boolean'];
  hasVoted: Scalars['Boolean'];
  inRevealPhase: Scalars['Boolean'];
};

export type MotionStateHistoryInput = {
  hasFailed: Scalars['Boolean'];
  hasFailedNotFinalizable: Scalars['Boolean'];
  hasPassed: Scalars['Boolean'];
  hasVoted: Scalars['Boolean'];
  inRevealPhase: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createColony?: Maybe<Colony>;
  createColonyAction?: Maybe<ColonyAction>;
  createColonyExtension?: Maybe<ColonyExtension>;
  createColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  createColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  createColonyMetadata?: Maybe<ColonyMetadata>;
  createColonyMotion?: Maybe<ColonyMotion>;
  createColonyRole?: Maybe<ColonyRole>;
  createColonyStake?: Maybe<ColonyStake>;
  createColonyTokens?: Maybe<ColonyTokens>;
  createContractEvent?: Maybe<ContractEvent>;
  createCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  createCurrentVersion?: Maybe<CurrentVersion>;
  createDomain?: Maybe<Domain>;
  createDomainMetadata?: Maybe<DomainMetadata>;
  createIngestorStats?: Maybe<IngestorStats>;
  createMotionMessage?: Maybe<MotionMessage>;
  createProfile?: Maybe<Profile>;
  createToken?: Maybe<Token>;
  createUniqueColony?: Maybe<Colony>;
  createUniqueUser?: Maybe<User>;
  createUser?: Maybe<User>;
  createUserTokens?: Maybe<UserTokens>;
  createWatchedColonies?: Maybe<WatchedColonies>;
  deleteColony?: Maybe<Colony>;
  deleteColonyAction?: Maybe<ColonyAction>;
  deleteColonyExtension?: Maybe<ColonyExtension>;
  deleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  deleteColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  deleteColonyMetadata?: Maybe<ColonyMetadata>;
  deleteColonyMotion?: Maybe<ColonyMotion>;
  deleteColonyRole?: Maybe<ColonyRole>;
  deleteColonyStake?: Maybe<ColonyStake>;
  deleteColonyTokens?: Maybe<ColonyTokens>;
  deleteContractEvent?: Maybe<ContractEvent>;
  deleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  deleteCurrentVersion?: Maybe<CurrentVersion>;
  deleteDomain?: Maybe<Domain>;
  deleteDomainMetadata?: Maybe<DomainMetadata>;
  deleteIngestorStats?: Maybe<IngestorStats>;
  deleteMotionMessage?: Maybe<MotionMessage>;
  deleteProfile?: Maybe<Profile>;
  deleteToken?: Maybe<Token>;
  deleteUser?: Maybe<User>;
  deleteUserTokens?: Maybe<UserTokens>;
  deleteWatchedColonies?: Maybe<WatchedColonies>;
  setCurrentVersion?: Maybe<Scalars['Boolean']>;
  updateColony?: Maybe<Colony>;
  updateColonyAction?: Maybe<ColonyAction>;
  updateColonyExtension?: Maybe<ColonyExtension>;
  updateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  updateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  updateColonyMetadata?: Maybe<ColonyMetadata>;
  updateColonyMotion?: Maybe<ColonyMotion>;
  updateColonyRole?: Maybe<ColonyRole>;
  updateColonyStake?: Maybe<ColonyStake>;
  updateColonyTokens?: Maybe<ColonyTokens>;
  updateContractEvent?: Maybe<ContractEvent>;
  updateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  updateCurrentVersion?: Maybe<CurrentVersion>;
  updateDomain?: Maybe<Domain>;
  updateDomainMetadata?: Maybe<DomainMetadata>;
  updateExtensionByColonyAndHash?: Maybe<ColonyExtension>;
  updateIngestorStats?: Maybe<IngestorStats>;
  updateMotionMessage?: Maybe<MotionMessage>;
  updateProfile?: Maybe<Profile>;
  updateToken?: Maybe<Token>;
  updateUser?: Maybe<User>;
  updateUserTokens?: Maybe<UserTokens>;
  updateWatchedColonies?: Maybe<WatchedColonies>;
};

export type MutationCreateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: CreateColonyInput;
};

export type MutationCreateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: CreateColonyActionInput;
};

export type MutationCreateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: CreateColonyExtensionInput;
};

export type MutationCreateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: CreateColonyFundsClaimInput;
};

export type MutationCreateColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: CreateColonyHistoricRoleInput;
};

export type MutationCreateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: CreateColonyMetadataInput;
};

export type MutationCreateColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: CreateColonyMotionInput;
};

export type MutationCreateColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: CreateColonyRoleInput;
};

export type MutationCreateColonyStakeArgs = {
  condition?: InputMaybe<ModelColonyStakeConditionInput>;
  input: CreateColonyStakeInput;
};

export type MutationCreateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: CreateColonyTokensInput;
};

export type MutationCreateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: CreateContractEventInput;
};

export type MutationCreateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: CreateCurrentNetworkInverseFeeInput;
};

export type MutationCreateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: CreateCurrentVersionInput;
};

export type MutationCreateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: CreateDomainInput;
};

export type MutationCreateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: CreateDomainMetadataInput;
};

export type MutationCreateIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: CreateIngestorStatsInput;
};

export type MutationCreateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: CreateMotionMessageInput;
};

export type MutationCreateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: CreateProfileInput;
};

export type MutationCreateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: CreateTokenInput;
};

export type MutationCreateUniqueColonyArgs = {
  input?: InputMaybe<CreateUniqueColonyInput>;
};

export type MutationCreateUniqueUserArgs = {
  input?: InputMaybe<CreateUniqueUserInput>;
};

export type MutationCreateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: CreateUserInput;
};

export type MutationCreateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: CreateUserTokensInput;
};

export type MutationCreateWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: CreateWatchedColoniesInput;
};

export type MutationDeleteColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: DeleteColonyInput;
};

export type MutationDeleteColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: DeleteColonyActionInput;
};

export type MutationDeleteColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: DeleteColonyExtensionInput;
};

export type MutationDeleteColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: DeleteColonyFundsClaimInput;
};

export type MutationDeleteColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: DeleteColonyHistoricRoleInput;
};

export type MutationDeleteColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: DeleteColonyMetadataInput;
};

export type MutationDeleteColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: DeleteColonyMotionInput;
};

export type MutationDeleteColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: DeleteColonyRoleInput;
};

export type MutationDeleteColonyStakeArgs = {
  condition?: InputMaybe<ModelColonyStakeConditionInput>;
  input: DeleteColonyStakeInput;
};

export type MutationDeleteColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: DeleteColonyTokensInput;
};

export type MutationDeleteContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: DeleteContractEventInput;
};

export type MutationDeleteCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: DeleteCurrentNetworkInverseFeeInput;
};

export type MutationDeleteCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: DeleteCurrentVersionInput;
};

export type MutationDeleteDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: DeleteDomainInput;
};

export type MutationDeleteDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: DeleteDomainMetadataInput;
};

export type MutationDeleteIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: DeleteIngestorStatsInput;
};

export type MutationDeleteMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: DeleteMotionMessageInput;
};

export type MutationDeleteProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: DeleteProfileInput;
};

export type MutationDeleteTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: DeleteTokenInput;
};

export type MutationDeleteUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: DeleteUserInput;
};

export type MutationDeleteUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: DeleteUserTokensInput;
};

export type MutationDeleteWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: DeleteWatchedColoniesInput;
};

export type MutationSetCurrentVersionArgs = {
  input?: InputMaybe<SetCurrentVersionInput>;
};

export type MutationUpdateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: UpdateColonyInput;
};

export type MutationUpdateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: UpdateColonyActionInput;
};

export type MutationUpdateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: UpdateColonyExtensionInput;
};

export type MutationUpdateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: UpdateColonyFundsClaimInput;
};

export type MutationUpdateColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: UpdateColonyHistoricRoleInput;
};

export type MutationUpdateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: UpdateColonyMetadataInput;
};

export type MutationUpdateColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: UpdateColonyMotionInput;
};

export type MutationUpdateColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: UpdateColonyRoleInput;
};

export type MutationUpdateColonyStakeArgs = {
  condition?: InputMaybe<ModelColonyStakeConditionInput>;
  input: UpdateColonyStakeInput;
};

export type MutationUpdateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: UpdateColonyTokensInput;
};

export type MutationUpdateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: UpdateContractEventInput;
};

export type MutationUpdateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: UpdateCurrentNetworkInverseFeeInput;
};

export type MutationUpdateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: UpdateCurrentVersionInput;
};

export type MutationUpdateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: UpdateDomainInput;
};

export type MutationUpdateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: UpdateDomainMetadataInput;
};

export type MutationUpdateExtensionByColonyAndHashArgs = {
  input?: InputMaybe<UpdateExtensionByColonyAndHashInput>;
};

export type MutationUpdateIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: UpdateIngestorStatsInput;
};

export type MutationUpdateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: UpdateMotionMessageInput;
};

export type MutationUpdateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: UpdateProfileInput;
};

export type MutationUpdateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: UpdateTokenInput;
};

export type MutationUpdateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: UpdateUserInput;
};

export type MutationUpdateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: UpdateUserTokensInput;
};

export type MutationUpdateWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: UpdateWatchedColoniesInput;
};

export type NativeTokenStatus = {
  __typename?: 'NativeTokenStatus';
  mintable?: Maybe<Scalars['Boolean']>;
  unlockable?: Maybe<Scalars['Boolean']>;
  unlocked?: Maybe<Scalars['Boolean']>;
};

export type NativeTokenStatusInput = {
  mintable?: InputMaybe<Scalars['Boolean']>;
  unlockable?: InputMaybe<Scalars['Boolean']>;
  unlocked?: InputMaybe<Scalars['Boolean']>;
};

export enum Network {
  Ganache = 'GANACHE',
  Gnosis = 'GNOSIS',
  Gnosisfork = 'GNOSISFORK',
  Goerli = 'GOERLI',
  Mainnet = 'MAINNET',
}

export type PendingModifiedTokenAddresses = {
  __typename?: 'PendingModifiedTokenAddresses';
  added?: Maybe<Array<Scalars['String']>>;
  removed?: Maybe<Array<Scalars['String']>>;
};

export type PendingModifiedTokenAddressesInput = {
  added?: InputMaybe<Array<Scalars['String']>>;
  removed?: InputMaybe<Array<Scalars['String']>>;
};

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['AWSEmail']>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  meta?: Maybe<ProfileMetadata>;
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  website?: Maybe<Scalars['AWSURL']>;
};

export type ProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['ID']>;
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type ProfileMetadata = {
  __typename?: 'ProfileMetadata';
  emailPermissions: Array<Scalars['String']>;
};

export type ProfileMetadataInput = {
  emailPermissions: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getActionsByColony?: Maybe<ModelColonyActionConnection>;
  getColoniesByNativeTokenId?: Maybe<ModelColonyConnection>;
  getColony?: Maybe<Colony>;
  getColonyAction?: Maybe<ColonyAction>;
  getColonyActionByMotionId?: Maybe<ModelColonyActionConnection>;
  getColonyByAddress?: Maybe<ModelColonyConnection>;
  getColonyByName?: Maybe<ModelColonyConnection>;
  getColonyByType?: Maybe<ModelColonyConnection>;
  getColonyExtension?: Maybe<ColonyExtension>;
  getColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  getColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  getColonyHistoricRoleByDate?: Maybe<ModelColonyHistoricRoleConnection>;
  getColonyMetadata?: Maybe<ColonyMetadata>;
  getColonyMotion?: Maybe<ColonyMotion>;
  getColonyRole?: Maybe<ColonyRole>;
  getColonyStake?: Maybe<ColonyStake>;
  getColonyTokens?: Maybe<ColonyTokens>;
  getContractEvent?: Maybe<ContractEvent>;
  getCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  getCurrentVersion?: Maybe<CurrentVersion>;
  getCurrentVersionByKey?: Maybe<ModelCurrentVersionConnection>;
  getDomain?: Maybe<Domain>;
  getDomainMetadata?: Maybe<DomainMetadata>;
  getExtensionByColonyAndHash?: Maybe<ModelColonyExtensionConnection>;
  getExtensionsByHash?: Maybe<ModelColonyExtensionConnection>;
  getIngestorStats?: Maybe<IngestorStats>;
  getMembersForColony?: Maybe<MembersForColonyReturn>;
  getMotionMessage?: Maybe<MotionMessage>;
  getMotionMessageByMotionId?: Maybe<ModelMotionMessageConnection>;
  getMotionState: Scalars['Int'];
  getMotionTimeoutPeriods?: Maybe<GetMotionTimeoutPeriodsReturn>;
  getProfile?: Maybe<Profile>;
  getProfileByEmail?: Maybe<ModelProfileConnection>;
  getReputationForTopDomains?: Maybe<GetReputationForTopDomainsReturn>;
  getToken?: Maybe<Token>;
  getTokenByAddress?: Maybe<ModelTokenConnection>;
  getTokenFromEverywhere?: Maybe<TokenFromEverywhereReturn>;
  getTokensByType?: Maybe<ModelTokenConnection>;
  getUser?: Maybe<User>;
  getUserByAddress?: Maybe<ModelUserConnection>;
  getUserByName?: Maybe<ModelUserConnection>;
  getUserReputation?: Maybe<Scalars['String']>;
  getUserStakeByAddress?: Maybe<ModelColonyStakeConnection>;
  getUserTokenBalance?: Maybe<GetUserTokenBalanceReturn>;
  getUserTokens?: Maybe<UserTokens>;
  getVoterRewards?: Maybe<VoterRewardsReturn>;
  getWatchedColonies?: Maybe<WatchedColonies>;
  listColonies?: Maybe<ModelColonyConnection>;
  listColonyActions?: Maybe<ModelColonyActionConnection>;
  listColonyExtensions?: Maybe<ModelColonyExtensionConnection>;
  listColonyFundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  listColonyHistoricRoles?: Maybe<ModelColonyHistoricRoleConnection>;
  listColonyMetadata?: Maybe<ModelColonyMetadataConnection>;
  listColonyMotions?: Maybe<ModelColonyMotionConnection>;
  listColonyRoles?: Maybe<ModelColonyRoleConnection>;
  listColonyStakes?: Maybe<ModelColonyStakeConnection>;
  listColonyTokens?: Maybe<ModelColonyTokensConnection>;
  listContractEvents?: Maybe<ModelContractEventConnection>;
  listCurrentNetworkInverseFees?: Maybe<ModelCurrentNetworkInverseFeeConnection>;
  listCurrentVersions?: Maybe<ModelCurrentVersionConnection>;
  listDomainMetadata?: Maybe<ModelDomainMetadataConnection>;
  listDomains?: Maybe<ModelDomainConnection>;
  listIngestorStats?: Maybe<ModelIngestorStatsConnection>;
  listMotionMessages?: Maybe<ModelMotionMessageConnection>;
  listProfiles?: Maybe<ModelProfileConnection>;
  listTokens?: Maybe<ModelTokenConnection>;
  listUserTokens?: Maybe<ModelUserTokensConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  listWatchedColonies?: Maybe<ModelWatchedColoniesConnection>;
};

export type QueryGetActionsByColonyArgs = {
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetColoniesByNativeTokenIdArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeTokenId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetColonyArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyActionArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyActionByMotionIdArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetColonyByAddressArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetColonyByNameArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetColonyByTypeArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: ColonyType;
};

export type QueryGetColonyExtensionArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyFundsClaimArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyHistoricRoleArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyHistoricRoleByDateArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: Scalars['String'];
};

export type QueryGetColonyMetadataArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyMotionArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyRoleArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyStakeArgs = {
  id: Scalars['ID'];
};

export type QueryGetColonyTokensArgs = {
  id: Scalars['ID'];
};

export type QueryGetContractEventArgs = {
  id: Scalars['ID'];
};

export type QueryGetCurrentNetworkInverseFeeArgs = {
  id: Scalars['ID'];
};

export type QueryGetCurrentVersionArgs = {
  id: Scalars['ID'];
};

export type QueryGetCurrentVersionByKeyArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  key: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetDomainArgs = {
  id: Scalars['ID'];
};

export type QueryGetDomainMetadataArgs = {
  id: Scalars['ID'];
};

export type QueryGetExtensionByColonyAndHashArgs = {
  colonyId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetExtensionsByHashArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetIngestorStatsArgs = {
  id: Scalars['ID'];
};

export type QueryGetMembersForColonyArgs = {
  input?: InputMaybe<MembersForColonyInput>;
};

export type QueryGetMotionMessageArgs = {
  id: Scalars['ID'];
};

export type QueryGetMotionMessageByMotionIdArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetMotionStateArgs = {
  input?: InputMaybe<GetMotionStateInput>;
};

export type QueryGetMotionTimeoutPeriodsArgs = {
  input?: InputMaybe<GetMotionTimeoutPeriodsInput>;
};

export type QueryGetProfileArgs = {
  id: Scalars['ID'];
};

export type QueryGetProfileByEmailArgs = {
  email: Scalars['AWSEmail'];
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetReputationForTopDomainsArgs = {
  input?: InputMaybe<GetReputationForTopDomainsInput>;
};

export type QueryGetTokenArgs = {
  id: Scalars['ID'];
};

export type QueryGetTokenByAddressArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetTokenFromEverywhereArgs = {
  input?: InputMaybe<TokenFromEverywhereArguments>;
};

export type QueryGetTokensByTypeArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: TokenType;
};

export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type QueryGetUserByAddressArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetUserByNameArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type QueryGetUserReputationArgs = {
  input?: InputMaybe<GetUserReputationInput>;
};

export type QueryGetUserStakeByAddressArgs = {
  colonyId?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userId: Scalars['ID'];
};

export type QueryGetUserTokenBalanceArgs = {
  input?: InputMaybe<GetUserTokenBalanceInput>;
};

export type QueryGetUserTokensArgs = {
  id: Scalars['ID'];
};

export type QueryGetVoterRewardsArgs = {
  input?: InputMaybe<GetVoterRewardsInput>;
};

export type QueryGetWatchedColoniesArgs = {
  id: Scalars['ID'];
};

export type QueryListColoniesArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyHistoricRolesArgs = {
  filter?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyMetadataArgs = {
  filter?: InputMaybe<ModelColonyMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyMotionsArgs = {
  filter?: InputMaybe<ModelColonyMotionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyStakesArgs = {
  filter?: InputMaybe<ModelColonyStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListContractEventsArgs = {
  filter?: InputMaybe<ModelContractEventFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListCurrentNetworkInverseFeesArgs = {
  filter?: InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListCurrentVersionsArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListDomainMetadataArgs = {
  filter?: InputMaybe<ModelDomainMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListIngestorStatsArgs = {
  filter?: InputMaybe<ModelIngestorStatsFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListMotionMessagesArgs = {
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListProfilesArgs = {
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListTokensArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListUserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListUsersArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type QueryListWatchedColoniesArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type SetCurrentVersionInput = {
  key: Scalars['String'];
  version: Scalars['Int'];
};

export enum SortingMethod {
  ByHighestRep = 'BY_HIGHEST_REP',
  ByLessPermissions = 'BY_LESS_PERMISSIONS',
  ByLowestRep = 'BY_LOWEST_REP',
  ByMorePermissions = 'BY_MORE_PERMISSIONS',
}

export type StakerRewards = {
  __typename?: 'StakerRewards';
  address: Scalars['String'];
  isClaimed: Scalars['Boolean'];
  rewards: MotionStakeValues;
};

export type StakerRewardsInput = {
  address: Scalars['String'];
  isClaimed: Scalars['Boolean'];
  rewards: MotionStakeValuesInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateColony?: Maybe<Colony>;
  onCreateColonyAction?: Maybe<ColonyAction>;
  onCreateColonyExtension?: Maybe<ColonyExtension>;
  onCreateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onCreateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onCreateColonyMetadata?: Maybe<ColonyMetadata>;
  onCreateColonyMotion?: Maybe<ColonyMotion>;
  onCreateColonyRole?: Maybe<ColonyRole>;
  onCreateColonyStake?: Maybe<ColonyStake>;
  onCreateColonyTokens?: Maybe<ColonyTokens>;
  onCreateContractEvent?: Maybe<ContractEvent>;
  onCreateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onCreateCurrentVersion?: Maybe<CurrentVersion>;
  onCreateDomain?: Maybe<Domain>;
  onCreateDomainMetadata?: Maybe<DomainMetadata>;
  onCreateIngestorStats?: Maybe<IngestorStats>;
  onCreateMotionMessage?: Maybe<MotionMessage>;
  onCreateProfile?: Maybe<Profile>;
  onCreateToken?: Maybe<Token>;
  onCreateUser?: Maybe<User>;
  onCreateUserTokens?: Maybe<UserTokens>;
  onCreateWatchedColonies?: Maybe<WatchedColonies>;
  onDeleteColony?: Maybe<Colony>;
  onDeleteColonyAction?: Maybe<ColonyAction>;
  onDeleteColonyExtension?: Maybe<ColonyExtension>;
  onDeleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onDeleteColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onDeleteColonyMetadata?: Maybe<ColonyMetadata>;
  onDeleteColonyMotion?: Maybe<ColonyMotion>;
  onDeleteColonyRole?: Maybe<ColonyRole>;
  onDeleteColonyStake?: Maybe<ColonyStake>;
  onDeleteColonyTokens?: Maybe<ColonyTokens>;
  onDeleteContractEvent?: Maybe<ContractEvent>;
  onDeleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onDeleteCurrentVersion?: Maybe<CurrentVersion>;
  onDeleteDomain?: Maybe<Domain>;
  onDeleteDomainMetadata?: Maybe<DomainMetadata>;
  onDeleteIngestorStats?: Maybe<IngestorStats>;
  onDeleteMotionMessage?: Maybe<MotionMessage>;
  onDeleteProfile?: Maybe<Profile>;
  onDeleteToken?: Maybe<Token>;
  onDeleteUser?: Maybe<User>;
  onDeleteUserTokens?: Maybe<UserTokens>;
  onDeleteWatchedColonies?: Maybe<WatchedColonies>;
  onUpdateColony?: Maybe<Colony>;
  onUpdateColonyAction?: Maybe<ColonyAction>;
  onUpdateColonyExtension?: Maybe<ColonyExtension>;
  onUpdateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onUpdateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onUpdateColonyMetadata?: Maybe<ColonyMetadata>;
  onUpdateColonyMotion?: Maybe<ColonyMotion>;
  onUpdateColonyRole?: Maybe<ColonyRole>;
  onUpdateColonyStake?: Maybe<ColonyStake>;
  onUpdateColonyTokens?: Maybe<ColonyTokens>;
  onUpdateContractEvent?: Maybe<ContractEvent>;
  onUpdateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onUpdateCurrentVersion?: Maybe<CurrentVersion>;
  onUpdateDomain?: Maybe<Domain>;
  onUpdateDomainMetadata?: Maybe<DomainMetadata>;
  onUpdateIngestorStats?: Maybe<IngestorStats>;
  onUpdateMotionMessage?: Maybe<MotionMessage>;
  onUpdateProfile?: Maybe<Profile>;
  onUpdateToken?: Maybe<Token>;
  onUpdateUser?: Maybe<User>;
  onUpdateUserTokens?: Maybe<UserTokens>;
  onUpdateWatchedColonies?: Maybe<WatchedColonies>;
};

export type SubscriptionOnCreateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};

export type SubscriptionOnCreateColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
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

export type SubscriptionOnCreateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};

export type SubscriptionOnCreateColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};

export type SubscriptionOnCreateColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};

export type SubscriptionOnCreateColonyStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyStakeFilterInput>;
};

export type SubscriptionOnCreateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};

export type SubscriptionOnCreateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
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

export type SubscriptionOnCreateIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
};

export type SubscriptionOnCreateMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};

export type SubscriptionOnCreateProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};

export type SubscriptionOnCreateTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};

export type SubscriptionOnCreateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};

export type SubscriptionOnCreateUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};

export type SubscriptionOnCreateWatchedColoniesArgs = {
  filter?: InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>;
};

export type SubscriptionOnDeleteColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};

export type SubscriptionOnDeleteColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
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

export type SubscriptionOnDeleteColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};

export type SubscriptionOnDeleteColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};

export type SubscriptionOnDeleteColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};

export type SubscriptionOnDeleteColonyStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyStakeFilterInput>;
};

export type SubscriptionOnDeleteColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};

export type SubscriptionOnDeleteContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
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

export type SubscriptionOnDeleteIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
};

export type SubscriptionOnDeleteMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};

export type SubscriptionOnDeleteProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};

export type SubscriptionOnDeleteTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};

export type SubscriptionOnDeleteUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};

export type SubscriptionOnDeleteUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};

export type SubscriptionOnDeleteWatchedColoniesArgs = {
  filter?: InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>;
};

export type SubscriptionOnUpdateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};

export type SubscriptionOnUpdateColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
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

export type SubscriptionOnUpdateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};

export type SubscriptionOnUpdateColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};

export type SubscriptionOnUpdateColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};

export type SubscriptionOnUpdateColonyStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyStakeFilterInput>;
};

export type SubscriptionOnUpdateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};

export type SubscriptionOnUpdateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
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

export type SubscriptionOnUpdateIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
};

export type SubscriptionOnUpdateMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};

export type SubscriptionOnUpdateProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};

export type SubscriptionOnUpdateTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};

export type SubscriptionOnUpdateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};

export type SubscriptionOnUpdateUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};

export type SubscriptionOnUpdateWatchedColoniesArgs = {
  filter?: InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>;
};

export type Token = {
  __typename?: 'Token';
  avatar?: Maybe<Scalars['String']>;
  chainMetadata: ChainMetadata;
  colonies?: Maybe<ModelColonyTokensConnection>;
  createdAt: Scalars['AWSDateTime'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  type?: Maybe<TokenType>;
  updatedAt: Scalars['AWSDateTime'];
  users?: Maybe<ModelUserTokensConnection>;
};

export type TokenColoniesArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type TokenUsersArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type TokenFromEverywhereArguments = {
  tokenAddress: Scalars['String'];
};

export type TokenFromEverywhereReturn = {
  __typename?: 'TokenFromEverywhereReturn';
  items?: Maybe<Array<Maybe<Token>>>;
};

export type TokenInput = {
  id: Scalars['ID'];
};

export enum TokenType {
  ChainNative = 'CHAIN_NATIVE',
  Colony = 'COLONY',
  Erc20 = 'ERC20',
}

export type UpdateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fundamentalChainId?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  individualEvents?: InputMaybe<Scalars['String']>;
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  isMotion?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['Int']>;
  motionId?: InputMaybe<Scalars['ID']>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  roles?: InputMaybe<ColonyActionRolesInput>;
  showInActionsList?: InputMaybe<Scalars['Boolean']>;
  toDomainId?: InputMaybe<Scalars['ID']>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<ColonyActionType>;
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
};

export type UpdateColonyHistoricRoleInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
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
  id: Scalars['ID'];
  motionsWithUnclaimedStakes?: InputMaybe<Array<ColonyUnclaimedStakeInput>>;
  name?: InputMaybe<Scalars['String']>;
  nativeTokenId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyMetadataInput = {
  avatar?: InputMaybe<Scalars['String']>;
  changelog?: InputMaybe<Array<ColonyMetadataChangelogInput>>;
  displayName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isWhitelistActivated?: InputMaybe<Scalars['Boolean']>;
  modifiedTokenAddresses?: InputMaybe<PendingModifiedTokenAddressesInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  whitelistedAddresses?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateColonyMotionInput = {
  createdBy?: InputMaybe<Scalars['String']>;
  hasObjection?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isFinalized?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['ID']>;
  motionStakes?: InputMaybe<MotionStakesInput>;
  motionStateHistory?: InputMaybe<MotionStateHistoryInput>;
  nativeMotionDomainId?: InputMaybe<Scalars['String']>;
  nativeMotionId?: InputMaybe<Scalars['String']>;
  remainingStakes?: InputMaybe<Array<Scalars['String']>>;
  repSubmitted?: InputMaybe<Scalars['String']>;
  requiredStake?: InputMaybe<Scalars['String']>;
  revealedVotes?: InputMaybe<MotionStakesInput>;
  rootHash?: InputMaybe<Scalars['String']>;
  skillRep?: InputMaybe<Scalars['String']>;
  stakerRewards?: InputMaybe<Array<StakerRewardsInput>>;
  userMinStake?: InputMaybe<Scalars['String']>;
  usersStakes?: InputMaybe<Array<UserStakesInput>>;
  voterRecord?: InputMaybe<Array<VoterRecordInput>>;
};

export type UpdateColonyRoleInput = {
  colonyRolesId?: InputMaybe<Scalars['ID']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  latestBlock?: InputMaybe<Scalars['Int']>;
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
};

export type UpdateColonyStakeInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  totalAmount?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
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
  nativeSkillId?: InputMaybe<Scalars['Int']>;
};

export type UpdateDomainMetadataInput = {
  changelog?: InputMaybe<Array<DomainMetadataChangelogInput>>;
  color?: InputMaybe<DomainColor>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateExtensionByColonyAndHashInput = {
  colonyId: Scalars['ID'];
  hash: Scalars['String'];
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  installedBy?: InputMaybe<Scalars['String']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateIngestorStatsInput = {
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['String']>;
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

export type UpdateProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  id: Scalars['ID'];
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
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
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  profileId?: InputMaybe<Scalars['ID']>;
};

export type UpdateUserTokensInput = {
  id: Scalars['ID'];
  tokenID?: InputMaybe<Scalars['ID']>;
  userID?: InputMaybe<Scalars['ID']>;
};

export type UpdateWatchedColoniesInput = {
  colonyID?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  userID?: InputMaybe<Scalars['ID']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['ID']>;
  stakes?: Maybe<ModelColonyStakeConnection>;
  tokens?: Maybe<ModelUserTokensConnection>;
  updatedAt: Scalars['AWSDateTime'];
  watchlist?: Maybe<ModelWatchedColoniesConnection>;
};

export type UserStakesArgs = {
  colonyId?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type UserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type UserWatchlistArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type UserDomainReputation = {
  __typename?: 'UserDomainReputation';
  domainId: Scalars['Int'];
  reputationPercentage: Scalars['String'];
};

export type UserStakes = {
  __typename?: 'UserStakes';
  address: Scalars['String'];
  stakes: MotionStakes;
};

export type UserStakesInput = {
  address: Scalars['String'];
  stakes: MotionStakesInput;
};

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

export type VoterRecord = {
  __typename?: 'VoterRecord';
  address: Scalars['String'];
  vote?: Maybe<Scalars['Int']>;
  voteCount: Scalars['String'];
};

export type VoterRecordInput = {
  address: Scalars['String'];
  vote?: InputMaybe<Scalars['Int']>;
  voteCount: Scalars['String'];
};

export type VoterRewardsReturn = {
  __typename?: 'VoterRewardsReturn';
  max: Scalars['String'];
  min: Scalars['String'];
  reward: Scalars['String'];
};

export type VotingReputationParams = {
  __typename?: 'VotingReputationParams';
  escalationPeriod: Scalars['String'];
  maxVoteFraction: Scalars['String'];
  revealPeriod: Scalars['String'];
  stakePeriod: Scalars['String'];
  submitPeriod: Scalars['String'];
  totalStakeFraction: Scalars['String'];
  userMinStakeFraction: Scalars['String'];
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

export type WatchedColonies = {
  __typename?: 'WatchedColonies';
  colony: Colony;
  colonyID: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userID: Scalars['ID'];
};

export type Watcher = {
  __typename?: 'Watcher';
  address: Scalars['String'];
  user?: Maybe<User>;
};

export type ColonyFragment = {
  __typename?: 'Colony';
  colonyAddress: string;
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
};

export type ExtensionFragment = {
  __typename?: 'ColonyExtension';
  id: string;
  colonyId: string;
  isInitialized: boolean;
};

export type ColonyMotionFragment = {
  __typename?: 'ColonyMotion';
  id: string;
  nativeMotionId: string;
  requiredStake: string;
  remainingStakes: Array<string>;
  userMinStake: string;
  rootHash: string;
  nativeMotionDomainId: string;
  isFinalized: boolean;
  createdBy: string;
  repSubmitted: string;
  skillRep: string;
  hasObjection: boolean;
  motionDomainId: string;
  motionStakes: {
    __typename?: 'MotionStakes';
    raw: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
    percentage: { __typename?: 'MotionStakeValues'; nay: string; yay: string };
  };
  usersStakes: Array<{
    __typename?: 'UserStakes';
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

export type UserStakesFragment = {
  __typename?: 'UserStakes';
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
  description: string;
  changelog?: Array<{
    __typename?: 'DomainMetadataChangelog';
    transactionHash: string;
    oldName: string;
    newName: string;
    oldColor: DomainColor;
    newColor: DomainColor;
    oldDescription: string;
    newDescription: string;
  }> | null;
};

export type ColonyMetadataFragment = {
  __typename?: 'ColonyMetadata';
  id: string;
  displayName: string;
  avatar?: string | null;
  thumbnail?: string | null;
  isWhitelistActivated?: boolean | null;
  whitelistedAddresses?: Array<string> | null;
  changelog?: Array<{
    __typename?: 'ColonyMetadataChangelog';
    transactionHash: string;
    oldDisplayName: string;
    newDisplayName: string;
    hasAvatarChanged: boolean;
    hasWhitelistChanged: boolean;
    haveTokensChanged: boolean;
  }> | null;
  modifiedTokenAddresses?: {
    __typename?: 'PendingModifiedTokenAddresses';
    added?: Array<string> | null;
    removed?: Array<string> | null;
  } | null;
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

export type SetCurrentVersionMutationVariables = Exact<{
  input: SetCurrentVersionInput;
}>;

export type SetCurrentVersionMutation = {
  __typename?: 'Mutation';
  setCurrentVersion?: boolean | null;
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

export type CreateColonyExtensionMutationVariables = Exact<{
  input: CreateColonyExtensionInput;
}>;

export type CreateColonyExtensionMutation = {
  __typename?: 'Mutation';
  createColonyExtension?: { __typename?: 'ColonyExtension'; id: string } | null;
};

export type UpdateColonyExtensionByColonyAndHashMutationVariables = Exact<{
  input: UpdateExtensionByColonyAndHashInput;
}>;

export type UpdateColonyExtensionByColonyAndHashMutation = {
  __typename?: 'Mutation';
  updateExtensionByColonyAndHash?: {
    __typename?: 'ColonyExtension';
    id: string;
  } | null;
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

export type CreateColonyTokensMutationVariables = Exact<{
  input: CreateColonyTokensInput;
}>;

export type CreateColonyTokensMutation = {
  __typename?: 'Mutation';
  createColonyTokens?: { __typename?: 'ColonyTokens'; id: string } | null;
};

export type DeleteColonyTokensMutationVariables = Exact<{
  input: DeleteColonyTokensInput;
}>;

export type DeleteColonyTokensMutation = {
  __typename?: 'Mutation';
  deleteColonyTokens?: { __typename?: 'ColonyTokens'; id: string } | null;
};

export type CreateColonyStakeMutationVariables = Exact<{
  colonyStakeId: Scalars['ID'];
  userAddress: Scalars['ID'];
  colonyAddress: Scalars['ID'];
  totalAmount: Scalars['String'];
}>;

export type CreateColonyStakeMutation = {
  __typename?: 'Mutation';
  createColonyStake?: { __typename?: 'ColonyStake'; id: string } | null;
};

export type UpdateColonyStakeMutationVariables = Exact<{
  colonyStakeId: Scalars['ID'];
  totalAmount: Scalars['String'];
}>;

export type UpdateColonyStakeMutation = {
  __typename?: 'Mutation';
  updateColonyStake?: { __typename?: 'ColonyStake'; id: string } | null;
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
    isWhitelistActivated?: boolean | null;
    whitelistedAddresses?: Array<string> | null;
    changelog?: Array<{
      __typename?: 'ColonyMetadataChangelog';
      transactionHash: string;
      oldDisplayName: string;
      newDisplayName: string;
      hasAvatarChanged: boolean;
      hasWhitelistChanged: boolean;
      haveTokensChanged: boolean;
    }> | null;
    modifiedTokenAddresses?: {
      __typename?: 'PendingModifiedTokenAddresses';
      added?: Array<string> | null;
      removed?: Array<string> | null;
    } | null;
  } | null;
};

export type GetColonyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyQuery = {
  __typename?: 'Query';
  getColony?: {
    __typename?: 'Colony';
    colonyAddress: string;
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
    items: Array<{ __typename?: 'Colony'; id: string } | null>;
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
    description: string;
    id: string;
    name: string;
    changelog?: Array<{
      __typename?: 'DomainMetadataChangelog';
      newColor: DomainColor;
      newDescription: string;
      newName: string;
      oldColor: DomainColor;
      oldDescription: string;
      oldName: string;
      transactionHash: string;
    }> | null;
  } | null;
};

export type GetContractEventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetContractEventQuery = {
  __typename?: 'Query';
  getContractEvent?: { __typename?: 'ContractEvent'; id: string } | null;
};

export type GetColonyExtensionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetColonyExtensionQuery = {
  __typename?: 'Query';
  getColonyExtension?: {
    __typename?: 'ColonyExtension';
    colonyId: string;
  } | null;
};

export type GetVotingRepInstallationsQueryVariables = Exact<{
  votingRepHash: Scalars['String'];
  colonyAddress: Scalars['ID'];
}>;

export type GetVotingRepInstallationsQuery = {
  __typename?: 'Query';
  getExtensionByColonyAndHash?: {
    __typename?: 'ModelColonyExtensionConnection';
    items: Array<{ __typename?: 'ColonyExtension'; id: string } | null>;
  } | null;
};

export type GetColonyExtensionsByColonyAddressQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;

export type GetColonyExtensionsByColonyAddressQuery = {
  __typename?: 'Query';
  getExtensionByColonyAndHash?: {
    __typename?: 'ModelColonyExtensionConnection';
    items: Array<{ __typename?: 'ColonyExtension'; id: string } | null>;
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
      colonyId: string;
      isInitialized: boolean;
    } | null>;
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
    items: Array<{ __typename?: 'ColonyFundsClaim'; id: string } | null>;
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
      pendingDomainMetadata?: {
        __typename?: 'DomainMetadata';
        name: string;
        color: DomainColor;
        description: string;
        changelog?: Array<{
          __typename?: 'DomainMetadataChangelog';
          transactionHash: string;
          oldName: string;
          newName: string;
          oldColor: DomainColor;
          newColor: DomainColor;
          oldDescription: string;
          newDescription: string;
        }> | null;
      } | null;
      pendingColonyMetadata?: {
        __typename?: 'ColonyMetadata';
        id: string;
        displayName: string;
        avatar?: string | null;
        thumbnail?: string | null;
        isWhitelistActivated?: boolean | null;
        whitelistedAddresses?: Array<string> | null;
        changelog?: Array<{
          __typename?: 'ColonyMetadataChangelog';
          transactionHash: string;
          oldDisplayName: string;
          newDisplayName: string;
          hasAvatarChanged: boolean;
          hasWhitelistChanged: boolean;
          haveTokensChanged: boolean;
        }> | null;
        modifiedTokenAddresses?: {
          __typename?: 'PendingModifiedTokenAddresses';
          added?: Array<string> | null;
          removed?: Array<string> | null;
        } | null;
      } | null;
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
    rootHash: string;
    nativeMotionDomainId: string;
    isFinalized: boolean;
    createdBy: string;
    repSubmitted: string;
    skillRep: string;
    hasObjection: boolean;
    motionDomainId: string;
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
      __typename?: 'UserStakes';
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
    };
  } | null;
};

export type CreateMotionMessageMutationVariables = Exact<{
  input: CreateMotionMessageInput;
}>;

export type CreateMotionMessageMutation = {
  __typename?: 'Mutation';
  createMotionMessage?: { __typename?: 'MotionMessage'; id: string } | null;
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

export type GetColonyStakeQueryVariables = Exact<{
  colonyStakeId: Scalars['ID'];
}>;

export type GetColonyStakeQuery = {
  __typename?: 'Query';
  getColonyStake?: { __typename?: 'ColonyStake'; totalAmount: string } | null;
};

export const Colony = gql`
  fragment Colony on Colony {
    colonyAddress: id
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
  }
`;
export const Extension = gql`
  fragment Extension on ColonyExtension {
    id
    colonyId
    isInitialized
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
export const UserStakes = gql`
  fragment UserStakes on UserStakes {
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
      ...UserStakes
    }
    userMinStake
    rootHash
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
    }
  }
  ${MotionStakes}
  ${UserStakes}
  ${StakerReward}
  ${VoterRecord}
`;
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
    changelog {
      transactionHash
      oldDisplayName
      newDisplayName
      hasAvatarChanged
      hasWhitelistChanged
      haveTokensChanged
    }
    isWhitelistActivated
    whitelistedAddresses
    modifiedTokenAddresses {
      added
      removed
    }
  }
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
export const SetCurrentVersionDocument = gql`
  mutation SetCurrentVersion($input: SetCurrentVersionInput!) {
    setCurrentVersion(input: $input)
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
export const CreateColonyExtensionDocument = gql`
  mutation CreateColonyExtension($input: CreateColonyExtensionInput!) {
    createColonyExtension(input: $input) {
      id
    }
  }
`;
export const UpdateColonyExtensionByColonyAndHashDocument = gql`
  mutation UpdateColonyExtensionByColonyAndHash(
    $input: UpdateExtensionByColonyAndHashInput!
  ) {
    updateExtensionByColonyAndHash(input: $input) {
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
export const CreateColonyTokensDocument = gql`
  mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
    createColonyTokens(input: $input) {
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
export const CreateColonyStakeDocument = gql`
  mutation CreateColonyStake(
    $colonyStakeId: ID!
    $userAddress: ID!
    $colonyAddress: ID!
    $totalAmount: String!
  ) {
    createColonyStake(
      input: {
        id: $colonyStakeId
        userId: $userAddress
        colonyId: $colonyAddress
        totalAmount: $totalAmount
      }
    ) {
      id
    }
  }
`;
export const UpdateColonyStakeDocument = gql`
  mutation UpdateColonyStake($colonyStakeId: ID!, $totalAmount: String!) {
    updateColonyStake(
      input: { id: $colonyStakeId, totalAmount: $totalAmount }
    ) {
      id
    }
  }
`;
export const GetColonyMetadataDocument = gql`
  query GetColonyMetadata($id: ID!) {
    getColonyMetadata(id: $id) {
      id
      displayName
      avatar
      thumbnail
      changelog {
        transactionHash
        oldDisplayName
        newDisplayName
        hasAvatarChanged
        hasWhitelistChanged
        haveTokensChanged
      }
      isWhitelistActivated
      whitelistedAddresses
      modifiedTokenAddresses {
        added
        removed
      }
    }
  }
`;
export const GetColonyDocument = gql`
  query GetColony($id: ID!) {
    getColony(id: $id) {
      ...Colony
    }
  }
  ${Colony}
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
export const GetContractEventDocument = gql`
  query GetContractEvent($id: ID!) {
    getContractEvent(id: $id) {
      id
    }
  }
`;
export const GetColonyExtensionDocument = gql`
  query GetColonyExtension($id: ID!) {
    getColonyExtension(id: $id) {
      colonyId
    }
  }
`;
export const GetVotingRepInstallationsDocument = gql`
  query GetVotingRepInstallations(
    $votingRepHash: String!
    $colonyAddress: ID!
  ) {
    getExtensionByColonyAndHash(
      colonyId: $colonyAddress
      hash: { eq: $votingRepHash }
    ) {
      items {
        id
      }
    }
  }
`;
export const GetColonyExtensionsByColonyAddressDocument = gql`
  query GetColonyExtensionsByColonyAddress($colonyAddress: ID!) {
    getExtensionByColonyAndHash(colonyId: $colonyAddress) {
      items {
        id
      }
    }
  }
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
      }
    ) {
      items {
        id
      }
    }
  }
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
        id
        pendingDomainMetadata {
          ...DomainMetadata
        }
        pendingColonyMetadata {
          ...ColonyMetadata
        }
      }
    }
  }
  ${DomainMetadata}
  ${ColonyMetadata}
`;
export const GetColonyMotionDocument = gql`
  query GetColonyMotion($id: ID!) {
    getColonyMotion(id: $id) {
      ...ColonyMotion
    }
  }
  ${ColonyMotion}
`;
export const CreateMotionMessageDocument = gql`
  mutation CreateMotionMessage($input: CreateMotionMessageInput!) {
    createMotionMessage(input: $input) {
      id
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
export const GetColonyHistoricRoleDocument = gql`
  query GetColonyHistoricRole($id: ID!) {
    getColonyHistoricRole(id: $id) {
      id
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
export const GetColonyStakeDocument = gql`
  query GetColonyStake($colonyStakeId: ID!) {
    getColonyStake(id: $colonyStakeId) {
      totalAmount
    }
  }
`;
