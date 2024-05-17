import { ColonyOperations, EventHandler } from '~types';
import {
  getCachedColonyClient,
  getStakedExpenditureClient,
  getStagedExpenditureClient,
  getOneTxPaymentClient,
  getVotingClient,
  verbose,
  SimpleTransactionDescription,
  parseOperation,
} from '~utils';
import {
  handleEditDomainMotion,
  handleAddDomainMotion,
  handleMintTokensMotion,
  handleNetworkUpgradeMotion,
  handleUnlockTokenMotion,
  handlePaymentMotion,
  handleMoveFundsMotion,
  handleDomainEditReputationMotion,
  handleEditColonyMotion,
  handleSetUserRolesMotion,
  handleSimpleDecisionMotion,
  handleMulticallMotion,
  handleMakeArbitraryTransactionsMotion,
  handleCancelStakedExpenditureMotion,
  handleMetadataDeltaMotion,
  handleCancelExpenditureViaArbitrationMotion,
  handleFinalizeExpenditureViaArbitrationMotion,
  handleReleaseStagedPaymentViaArbitration,
} from './handlers';
import { ExtensionEventListener } from '~eventListeners';

export const handleMotionCreated: EventHandler = async (
  event,
  listener,
): Promise<void> => {
  const {
    args: { motionId },
    blockNumber,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const votingReputationClient = await getVotingClient(colonyAddress);

  if (!colonyClient || !votingReputationClient) {
    return;
  }

  const oneTxPaymentClient = await getOneTxPaymentClient(colonyAddress);

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  const stagedExpenditureClient = await getStagedExpenditureClient(
    colonyAddress,
  );

  const motion = await votingReputationClient.getMotion(motionId, {
    blockTag: blockNumber,
  });
  const parsedOperation = parseOperation(motion.action, {
    colonyClient,
    oneTxPaymentClient,
    stakedExpenditureClient,
    stagedExpenditureClient,
  });

  if (parsedOperation) {
    const contractOperation = parsedOperation.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.MintTokens: {
        await handleMintTokensMotion(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.AddDomain: {
        await handleAddDomainMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.EditDomain: {
        await handleEditDomainMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.Upgrade: {
        await handleNetworkUpgradeMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.EmitDomainReputationReward:
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleDomainEditReputationMotion(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }

      case ColonyOperations.EditColony: {
        await handleEditColonyMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMotion(
          colonyAddress,
          event,
          parsedOperation,
          motion.altTarget,
        );
        break;
      }

      case ColonyOperations.Multicall: {
        await handleMulticallMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.SimpleDecision: {
        await handleSimpleDecisionMotion(
          colonyAddress,
          event,
          parsedOperation as SimpleTransactionDescription,
        );
        break;
      }

      case ColonyOperations.MakeArbitraryTransactions: {
        await handleMakeArbitraryTransactionsMotion(
          colonyAddress,
          event,
          parsedOperation,
        );

        break;
      }

      case ColonyOperations.CancelStakedExpenditure: {
        await handleCancelStakedExpenditureMotion(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }

      case ColonyOperations.EditColonyByDelta: {
        await handleMetadataDeltaMotion(colonyAddress, event, parsedOperation);
        break;
      }

      case ColonyOperations.CancelExpenditureViaArbitration: {
        await handleCancelExpenditureViaArbitrationMotion(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }

      case ColonyOperations.FinalizeExpenditureViaArbitration: {
        await handleFinalizeExpenditureViaArbitrationMotion(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }

      case ColonyOperations.ReleaseStagedPaymentViaArbitration: {
        await handleReleaseStagedPaymentViaArbitration(
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      default: {
        break;
      }
    }

    verbose(`${contractOperation} Motion Created`);
  }
};
