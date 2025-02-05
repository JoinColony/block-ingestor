import { utils } from 'ethers';

import { ColonyOperations } from '~types';
import {
  getCachedColonyClient,
  getStakedExpenditureClient,
  getStagedExpenditureClient,
  getOneTxPaymentClient,
  getVotingClient,
  SimpleTransactionDescription,
  parseMotionAction,
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
import { output, verbose } from '@joincolony/utils';
import {
  EventHandler,
  ExtensionEventListener,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import networkClient from '~networkClient';
import { handleCreateProxyColonyMotion } from './handlers/proxyColonies/createProxyColony';

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

  /**
   * @NOTE: This is not good, we should use ABIs from @colony/abis instead.
   * It would avoid having to make network calls each time the motion is created
   */
  const interfaces = [
    colonyClient.interface,
    oneTxPaymentClient?.interface,
    stakedExpenditureClient?.interface,
    stagedExpenditureClient?.interface,
    networkClient.interface,
    ProxyColonyEvents,
  ].filter(Boolean) as utils.Interface[]; // Casting seems necessary as TS does not pick up the .filter()

  const parsedAction = parseMotionAction(motion.action, interfaces);

  if (!parsedAction) {
    output(`Failed to parse motion action: ${motion.action}`);
    return;
  }

  if (parsedAction) {
    const contractOperation = parsedAction.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.MintTokens: {
        await handleMintTokensMotion(colonyAddress, event, parsedAction);
        break;
      }
      case ColonyOperations.AddDomain: {
        await handleAddDomainMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.EditDomain: {
        await handleEditDomainMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.Upgrade: {
        await handleNetworkUpgradeMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.EmitDomainReputationReward:
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleDomainEditReputationMotion(
          colonyAddress,
          event,
          parsedAction,
        );
        break;
      }

      case ColonyOperations.EditColony: {
        await handleEditColonyMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMotion(
          colonyAddress,
          event,
          parsedAction,
          motion.altTarget,
        );
        break;
      }

      case ColonyOperations.Multicall: {
        await handleMulticallMotion(
          colonyAddress,
          event,
          parsedAction,
          interfaces,
        );
        break;
      }

      case ColonyOperations.SimpleDecision: {
        await handleSimpleDecisionMotion(
          colonyAddress,
          event,
          parsedAction as SimpleTransactionDescription,
        );
        break;
      }

      case ColonyOperations.MakeArbitraryTransactions: {
        await handleMakeArbitraryTransactionsMotion(
          colonyAddress,
          event,
          parsedAction,
        );

        break;
      }

      case ColonyOperations.CancelStakedExpenditure: {
        await handleCancelStakedExpenditureMotion(
          colonyAddress,
          event,
          parsedAction,
        );
        break;
      }

      case ColonyOperations.EditColonyByDelta: {
        await handleMetadataDeltaMotion(colonyAddress, event, parsedAction);
        break;
      }

      case ColonyOperations.CancelExpenditureViaArbitration: {
        await handleCancelExpenditureViaArbitrationMotion(
          colonyAddress,
          event,
          parsedAction,
        );
        break;
      }

      case ColonyOperations.FinalizeExpenditureViaArbitration: {
        await handleFinalizeExpenditureViaArbitrationMotion(
          colonyAddress,
          event,
          parsedAction,
        );
        break;
      }

      case ColonyOperations.ReleaseStagedPaymentViaArbitration: {
        await handleReleaseStagedPaymentViaArbitration(
          colonyAddress,
          event,
          parsedAction,
        );
        break;
      }

      case ColonyOperations.CreateProxyColony: {
        await handleCreateProxyColonyMotion(colonyAddress, event, parsedAction);
        break;
      }

      default: {
        break;
      }
    }

    verbose(`${contractOperation} Motion Created`);
  }
};
