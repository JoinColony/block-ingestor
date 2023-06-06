import { ColonyActionType } from '~graphql';
import { ColonyOperations } from './events';

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

export enum MotionSide {
  YAY = 'yay',
  NAY = 'nay',
}

export enum MotionVote {
  NAY,
  YAY,
}
