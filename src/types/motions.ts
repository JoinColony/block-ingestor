import { ColonyActionType } from '~graphql';

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
  SetUserRoles = 'setUserRoles',
  SimpleDecision = 'simpleDecision',
  Multicall = 'multicall',
  MakeArbitraryTransactions = 'makeArbitraryTransactions',
  CancelStakedExpenditure = 'cancelAndPunish',
  SetExpenditureState = 'setExpenditureState',
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
  [ColonyOperations.AddDomain]: ColonyActionType.CreateDomainMotion,
  [ColonyOperations.EditDomain]: ColonyActionType.EditDomainMotion,
  [ColonyOperations.MakePaymentFundedFromDomain]:
    ColonyActionType.PaymentMotion,
  [ColonyOperations.UnlockToken]: ColonyActionType.UnlockTokenMotion,
  [ColonyOperations.EditColony]: ColonyActionType.ColonyEditMotion,
  [ColonyOperations.SetUserRoles]: ColonyActionType.SetUserRolesMotion,
  [ColonyOperations.MoveFundsBetweenPots]: ColonyActionType.MoveFundsMotion,
  [ColonyOperations.Upgrade]: ColonyActionType.VersionUpgradeMotion,
  [ColonyOperations.EmitDomainReputationPenalty]:
    ColonyActionType.EmitDomainReputationPenaltyMotion,
  [ColonyOperations.EmitDomainReputationReward]:
    ColonyActionType.EmitDomainReputationRewardMotion,
  [ColonyOperations.SimpleDecision]: ColonyActionType.CreateDecisionMotion,
  [ColonyOperations.MakeArbitraryTransactions]:
    ColonyActionType.MakeArbitraryTransactionsMotion,
  [ColonyOperations.CancelStakedExpenditure]:
    ColonyActionType.CancelStakedExpenditureMotion,
  [ColonyOperations.SetExpenditureState]:
    ColonyActionType.SetExpenditureStateMotion,
};

export enum MotionSide {
  YAY = 'yay',
  NAY = 'nay',
}

export enum MotionVote {
  NAY,
  YAY,
}
