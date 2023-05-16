import { ColonyActionType } from '~types';

export enum MotionSide {
  YAY = 'yay',
  NAY = 'nay',
}

export enum MotionVote {
  NAY,
  YAY,
}

/*
 * Contract calls
 */
export enum ColonyOperations {
  MintTokens = 'mintTokens',
  AddDomain = 'addDomain',
  EditDomain = 'editDomain',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
  MakePaymentFundedFromDomain = 'makePaymentFundedFromDomain',
  MoveFundsBetweenPots = 'moveFundsBetweenPots',
  EmitDomainReputationPenalty = 'emitDomainReputationPenalty',
  EmitDomainReputationReward = 'emitDomainReputationReward',
  EditColony = 'editColony',
}

export enum MotionEvents {
  MotionCreated = 'MotionCreated',
  MotionStaked = 'MotionStaked',
  MotionFinalized = 'MotionFinalized',
  ObjectionRaised = 'ObjectionRaised',
  ObjectionFullyStaked = 'ObjectionFullyStaked',
  MotionFullyStaked = 'MotionFullyStaked',
  MotionFullyStakedAfterObjection = 'MotionFullyStakedAfterObjection',
  MotionVotingPhase = 'MotionVotingPhase',
  MotionRewardClaimed = 'MotionRewardClaimed',
  MotionRevealResultObjectionWon = 'MotionRevealResultObjectionWon',
  MotionHasFailedFinalizable = 'MotionHasFailedFinalizable',
  MotionRevealResultMotionWon = 'MotionRevealResultMotionWon',
}

export const motionNameMapping: { [key: string]: ColonyActionType } = {
  [ColonyOperations.MintTokens]: ColonyActionType.MintTokensMotion,
  // makePaymentFundedFromDomain: ColonyMotions.PaymentMotion,
  // unlockToken: ColonyMotions.UnlockTokenMotion,
  [ColonyOperations.AddDomain]: ColonyActionType.CreateDomainMotion,
  [ColonyOperations.EditDomain]: ColonyActionType.EditDomainMotion,
  [ColonyOperations.MakePaymentFundedFromDomain]:
    ColonyActionType.PaymentMotion,
  [ColonyOperations.UnlockToken]: ColonyActionType.UnlockTokenMotion,
  // addDomain: ColonyMotions.CreateDomainMotion,
  // editDomain: ColonyMotions.EditDomainMotion,
  [ColonyOperations.EditColony]: ColonyActionType.ColonyEditMotion,
  // setUserRoles: ColonyMotions.SetUserRolesMotion,
  [ColonyOperations.MoveFundsBetweenPots]: ColonyActionType.MoveFundsMotion,
  [ColonyOperations.Upgrade]: ColonyActionType.VersionUpgradeMotion,
  emitDomainReputationPenalty:
    ColonyActionType.EmitDomainReputationPenaltyMotion,
  emitDomainReputationReward: ColonyActionType.EmitDomainReputationRewardMotion,
};

interface MotionStakeFragment {
  [MotionSide.NAY]: string;
  [MotionSide.YAY]: string;
}

export interface MotionStakes {
  raw: MotionStakeFragment;
  percentage: MotionStakeFragment;
}

type MotionVotes = MotionStakes;

export interface VoterRecord {
  address: string;
  voteCount: string;
  vote: number | null;
}

export interface MotionStateHistory {
  hasVoted: boolean;
  hasPassed: boolean;
  hasFailed: boolean;
  hasFailedNotFinalizable: boolean;
  inRevealPhase: boolean;
}

export interface MotionData {
  motionId: string;
  nativeMotionId: string;
  usersStakes: UserStakes[];
  motionStakes: MotionStakes;
  remainingStakes: [string, string];
  userMinStake: string;
  requiredStake: string;
  rootHash: string; // For calculating user's max stake in client
  motionDomainId: string;
  stakerRewards: StakerReward[];
  isFinalized: boolean;
  createdBy: string;
  voterRecord: VoterRecord[];
  revealedVotes: MotionVotes;
  repSubmitted: string;
  skillRep: string;
  hasObjection: boolean;
  motionStateHistory: MotionStateHistory;
  messages: MotionMessage[];
}

export interface UserStakes {
  address: string;
  stakes: MotionStakes;
}

export interface StakerReward {
  address: string;
  rewards: MotionStakeFragment;
  isClaimed: boolean;
}

enum DomainColor {
  LIGHT_PINK,
  PINK,
  BLACK,
  EMERALD_GREEN,
  BLUE,
  YELLOW,
  RED,
  GREEN,
  PERIWINKLE,
  GOLD,
  AQUA,
  BLUE_GREY,
  PURPLE,
  ORANGE,
  MAGENTA,
  PURPLE_GREY,
}

interface DomainMetadataChangelog {
  transactionHash: string;
  oldName: string;
  newName: string;
  oldColor: DomainColor;
  newColor: DomainColor;
  oldDescription: string;
  newDescription: string;
}

interface DomainMetadata {
  id: string;
  name: string;
  description: string;
  color: string;
  changelog: [DomainMetadataChangelog];
}

interface ColonyMetadataChangelog {
  transactionHash: string;
  oldDisplayName: string;
  newDisplayName: string;
  hasAvatarChanged: boolean;
  hasWhitelistChanged: boolean;
  haveTokensChanged: boolean;
}

export interface PendingModifiedTokenAddresses {
  added: string[];
  removed: string[];
}

export interface ColonyMetadata {
  id: string;
  displayName: string;
  avatar?: string;
  thumbnail?: string;
  changelog?: ColonyMetadataChangelog[];
  isWhitelistActivated?: boolean;
  whitelistedAddresses?: string[];
  modifiedTokenAddresses?: PendingModifiedTokenAddresses;
}

export interface MotionQuery {
  id: string;
  motionData: MotionData;
  createdAt: string;
  pendingDomainMetadata: DomainMetadata;
  pendingColonyMetadata: ColonyMetadata;
}

export interface MotionMessage {
  name: string;
  messageKey: string;
  initiatorAddress?: string;
  vote?: string;
  amount?: string;
}
