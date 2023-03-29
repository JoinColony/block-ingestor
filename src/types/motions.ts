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
}

export const motionNameMapping: { [key: string]: ColonyActionType } = {
  [ColonyOperations.MintTokens]: ColonyActionType.MintTokensMotion,
  // makePaymentFundedFromDomain: ColonyMotions.PaymentMotion,
  // unlockToken: ColonyMotions.UnlockTokenMotion,
  // addDomain: ColonyMotions.CreateDomainMotion,
  // editDomain: ColonyMotions.EditDomainMotion,
  // editColony: ColonyMotions.ColonyEditMotion,
  // setUserRoles: ColonyMotions.SetUserRolesMotion,
  // moveFundsBetweenPots: ColonyMotions.MoveFundsMotion,
  // upgrade: ColonyMotions.VersionUpgradeMotion,
  // emitDomainReputationPenalty: ColonyMotions.EmitDomainReputationPenaltyMotion,
  // emitDomainReputationReward: ColonyMotions.EmitDomainReputationRewardMotion,
};

interface MotionStakeFragment {
  [MotionSide.NAY]: string;
  [MotionSide.YAY]: string;
}

export interface MotionStakes {
  raw: MotionStakeFragment;
  percentage: MotionStakeFragment;
}

export interface MotionData {
  motionId: string;
  usersStakes: UserStakes[];
  motionStakes: MotionStakes;
  remainingStakes: [string, string];
  userMinStake: string;
  requiredStake: string;
  // For calculating user's max stake in client
  rootHash: string;
  motionDomainId: string;
  stakerRewards: StakerReward[];
  isFinalized: boolean;
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

export interface MotionQuery {
  id: string;
  motionData: MotionData;
  createdAt: string;
}
