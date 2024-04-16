import { BigNumber, constants } from 'ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { ColonyOperations, EventHandler } from '~types';
import {
  getCachedColonyClient,
  getStakedExpenditureClient,
  getStagedExpenditureClient,
  getOneTxPaymentClient,
  getVotingClient,
  verbose,
} from '~utils';
import { SimpleTransactionDescription, parseAction } from './helpers';
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
  const parsedAction = parseAction(motion.action, {
    colonyClient,
    oneTxPaymentClient,
    stakedExpenditureClient,
    stagedExpenditureClient,
  });

  let gasEstimate: BigNumber;

  const estimateMotionGas = async (): Promise<string> =>
    /*
     * @NOTE Express casting required here since colonyJS forces it's own types internally
     * Even though we instantiate the initial network client with a StaticJsonRpcProvider, colonyJS
     * will internally cast it to a BaseProvider which is a generic type that doesn't declare
     * all the methods actually available on the provider
     *
     * Alternatively, we could just import our provider directly and use that instead
     *
     * Ultimately it's the same thing as the provider instance is the same
     */
    await (colonyClient.provider as StaticJsonRpcProvider).send(
      'eth_estimateGas',
      [
        {
          from: votingReputationClient.address,
          to:
            /*
             * If the motion target is 0x000... then we pass in the colony's address
             */
            motion.altTarget === constants.AddressZero
              ? colonyClient.address
              : motion.altTarget,
          data: motion.action,
        },
        blockNumber,
      ],
    );

  try {
    const estimatedGasHexString = await estimateMotionGas();
    gasEstimate = BigNumber.from(estimatedGasHexString);
  } catch {
    // Sometimes the call to estimate gas fails. Let's try one more time...
    try {
      const estimatedGasHexString = await estimateMotionGas();
      gasEstimate = BigNumber.from(estimatedGasHexString);
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
        await handleMintTokensMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }
      case ColonyOperations.AddDomain: {
        await handleAddDomainMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.EditDomain: {
        await handleEditDomainMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.Upgrade: {
        await handleNetworkUpgradeMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.EmitDomainReputationReward:
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleDomainEditReputationMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.EditColony: {
        await handleEditColonyMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.Multicall: {
        await handleMulticallMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.SimpleDecision: {
        await handleSimpleDecisionMotion(
          colonyAddress,
          event,
          parsedAction as SimpleTransactionDescription,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.MakeArbitraryTransactions: {
        await handleMakeArbitraryTransactionsMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );

        break;
      }

      case ColonyOperations.CancelStakedExpenditure: {
        await handleCancelStakedExpenditureMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.EditColonyByDelta: {
        await handleMetadataDeltaMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.CancelExpenditureViaArbitration: {
        await handleCancelExpenditureViaArbitrationMotion(
          colonyAddress,
          event,
          parsedAction,
          gasEstimate,
        );
        break;
      }

      case ColonyOperations.FinalizeExpenditureViaArbitration: {
        await handleFinalizeExpenditureViaArbitrationMotion(
          colonyAddress,
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
