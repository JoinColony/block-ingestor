import { TransactionDescription } from 'ethers/lib/utils';
import { ColonyActionType } from '~types';

/*
 * Contract calls
 */
export enum ColonyOperations {
  MintTokens = 'mintTokens',
}

export interface AugmentedMotionData {
  parsedAction: TransactionDescription;
  motionData: MotionData;
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

export interface MotionQuery {
  id: string;
  motionData: MotionData;
}

export enum MotionSide {
  YAY = 'yay',
  NAY = 'nay',
}

export interface MotionStakeFragment {
  [MotionSide.YAY]: string;
  [MotionSide.NAY]: string;
}

export interface MotionStakes {
  raw: MotionStakeFragment;
  percentage: MotionStakeFragment;
}

export interface UserStake {
  address: string;
  stakes: {
    raw: MotionStakeFragment;
  };
}

export interface MotionData {
  rootHash: string;
  motionStakes: MotionStakes;
  usersStakes: UserStake[];
  motionState: number;
  motionDomainId: string;
  skillRep: string;
  motionId: string;
}
