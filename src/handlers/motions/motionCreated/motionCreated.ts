import { BigNumber, constants } from 'ethers';

import { ColonyOperations, ContractEvent } from '~types';
import {
  getCachedColonyClient,
  getStakedExpenditureClient,
  getOneTxPaymentClient,
  getVotingClient,
  verbose,
  getStreamingPaymentsClient,
} from '~utils';
import { SimpleTransactionDescription, parseAction } from './helpers';
import {
  handleManageDomainMotion,
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
  handleCancelStakedExpenditureMotion,
  handleCreateStreamingPaymentMotion,
} from './handlers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    args: { motionId },
    colonyAddress,
  } = event;

  if (!colonyAddress) {
    return;
  }

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const votingReputationClient = await getVotingClient(colonyAddress);

  if (!colonyClient || !votingReputationClient) {
    return;
  }

  const oneTxPaymentClient = await getOneTxPaymentClient(colonyAddress);

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  const streamingPaymentClient = await getStreamingPaymentsClient(colonyAddress);

  const motion = await votingReputationClient.getMotion(motionId);
  const parsedAction = parseAction(motion.action, [
    colonyClient,
    oneTxPaymentClient,
    stakedExpenditureClient,
    streamingPaymentClient,
  ]);

  let gasEstimate: BigNumber;

  const estimateMotionGas = async (): Promise<BigNumber> =>
    await colonyClient.provider.estimateGas({
      from: votingReputationClient.address,
      to:
        /*
         * If the motion target is 0x000... then we pass in the colony's address
         */
        motion.altTarget === constants.AddressZero
          ? colonyClient.address
          : motion.altTarget,
      data: motion.action,
    });

  try {
    gasEstimate = await estimateMotionGas();
  } catch {
    // Sometimes the call to estimate gas fails. Let's try one more time...
    try {
      gasEstimate = await estimateMotionGas();
    } catch {
      const manualEstimate = 500_000;
      // If it fails again, let's just set it manually.
      console.error(
        `Unable to estimate gas for motion's action. Manually setting to ${manualEstimate}`,
      );
      gasEstimate = BigNumber.from(manualEstimate);
    }
  }

  /*
   * Increase the estimate by 100k WEI. This is a flat increase for all networks
   *
   * @NOTE This will need to be increased further for `setExpenditureState` since
   * that requires even more gas, but since we don't use that one yet, there's
   * no reason to account for it just yet
   */
  gasEstimate = gasEstimate.add(100_000);

  if (parsedAction) {
    const contractOperation = parsedAction.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.MintTokens: {
        await handleMintTokensMotion(event, parsedAction, gasEstimate);
        break;
      }
      case ColonyOperations.AddDomain:
      case ColonyOperations.EditDomain: {
        await handleManageDomainMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.Upgrade: {
        await handleNetworkUpgradeMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.EmitDomainReputationReward:
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleDomainEditReputationMotion(
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.EditColony: {
        await handleEditColonyMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.Multicall: {
        await handleMulticallMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.SimpleDecision: {
        await handleSimpleDecisionMotion(
          event,
          parsedAction as SimpleTransactionDescription,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.CancelStakedExpenditure: {
        await handleCancelStakedExpenditureMotion(
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.CreateStreamingPayment: {
        await handleCreateStreamingPaymentMotion(
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
