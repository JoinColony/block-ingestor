import { ContractEventsSignatures } from '~types';
import { handleMintTokensAction } from '~actions/actionHandlers';

// Mock handlers for other actions
const handleCreateDomainAction = async (event) => {
  /* Implementation */
};
const handleEditDomainAction = async (event) => {
  /* Implementation */
};
const handleFundingPotCreatedAction = async (event) => {
  /* Implementation */
};
const handlePaymentAction = async (event) => {
  /* Implementation */
};
const handleMoveFundsAction = async (event) => {
  /* Implementation */
};
const handleCreateTaskAction = async (event) => {
  /* Implementation */
};
const handleCancelTaskAction = async (event) => {
  /* Implementation */
};
const handleFinalizeTaskAction = async (event) => {
  /* Implementation */
};
const handleSetTaskSkillAction = async (event) => {
  /* Implementation */
};
const handleSetTaskDueDateAction = async (event) => {
  /* Implementation */
};
const handleSetTaskBriefAction = async (event) => {
  /* Implementation */
};
const handleSetTaskManagerAction = async (event) => {
  /* Implementation */
};
const handleSetTaskWorkerRoleAction = async (event) => {
  /* Implementation */
};
const handleSetTaskEvaluatorRoleAction = async (event) => {
  /* Implementation */
};
const handleSubmitTaskDeliverableAction = async (event) => {
  /* Implementation */
};
const handleSubmitTaskWorkRatingAction = async (event) => {
  /* Implementation */
};
const handleRevealTaskWorkRatingAction = async (event) => {
  /* Implementation */
};
const handleClaimPayoutAction = async (event) => {
  /* Implementation */
};
const handleAddGlobalSkillAction = async (event) => {
  /* Implementation */
};
const handleAddDomainSkillAction = async (event) => {
  /* Implementation */
};
const handleEmitDomainReputationAction = async (event) => {
  /* Implementation */
};
const handleEmitSkillReputationAction = async (event) => {
  /* Implementation */
};
const handleColonyRoleSetAction = async (event) => {
  /* Implementation */
};
const handleColonyInitialisedAction = async (event) => {
  /* Implementation */
};
const handleColonyUpgradedAction = async (event) => {
  /* Implementation */
};
const handleRecoveryModeEnteredAction = async (event) => {
  /* Implementation */
};
const handleRecoveryModeExitedAction = async (event) => {
  /* Implementation */
};
const handleMotionCreatedAction = async (event) => {
  /* Implementation */
};
const handleMotionFinalizedAction = async (event) => {
  /* Implementation */
};
const handleMotionEscalatedAction = async (event) => {
  /* Implementation */
};
const handleMotionVoteSubmittedAction = async (event) => {
  /* Implementation */
};
const handleMotionVoteRevealedAction = async (event) => {
  /* Implementation */
};
const handleMotionRewardClaimedAction = async (event) => {
  /* Implementation */
};
const handleTokensBurnedAction = async (event) => {
  /* Implementation */
};
const handleTokensLockAction = async (event) => {
  /* Implementation */
};
const handleTokensUnlockAction = async (event) => {
  /* Implementation */
};
const handleReputationMiningCycleCompleteAction = async (event) => {
  /* Implementation */
};
const handleNetworkFeeInverseSet = async (event) => {
  /* Implementation */
};

const actionMatchers = [
  {
    eventSignatures: [ContractEventsSignatures.TokensMinted],
    handler: handleMintTokensAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.DomainAdded],
    handler: handleCreateDomainAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.DomainMetadata],
    handler: handleEditDomainAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.FundingPotAdded],
    handler: handleFundingPotCreatedAction,
  },
  {
    eventSignatures: [
      ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots,
    ],
    handler: handleMoveFundsAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.PayoutClaimed],
    handler: handleClaimPayoutAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.ColonyRoleSet],
    handler: handleColonyRoleSetAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.ColonyUpgraded],
    handler: handleColonyUpgradedAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.MotionCreated],
    handler: handleMotionCreatedAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.MotionFinalized],
    handler: handleMotionFinalizedAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.MotionVoteSubmitted],
    handler: handleMotionVoteSubmittedAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.MotionVoteRevealed],
    handler: handleMotionVoteRevealedAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.MotionRewardClaimed],
    handler: handleMotionRewardClaimedAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.ReputationMiningCycleComplete],
    handler: handleReputationMiningCycleCompleteAction,
  },
  {
    eventSignatures: [ContractEventsSignatures.NetworkFeeInverseSet],
    handler: handleNetworkFeeInverseSet,
  },
];
