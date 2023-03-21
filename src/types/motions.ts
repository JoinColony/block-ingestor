import { ColonyActionType } from '~types';

export enum MotionSide {
  YAY = 'yay',
  NAY = 'nay',
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
}

export interface UserStakes {
  address: string;
  stakes: MotionStakes;
}

export interface MotionQuery {
  id: string;
  motionData: MotionData;
}
