import { BigNumber, constants } from 'ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { ColonyOperations, ContractEvent } from '~types';
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
} from './handlers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    args: { motionId },
    colonyAddress,
    blockNumber,
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
        await handleMintTokensMotion(event, parsedAction, gasEstimate);
        break;
      }
      case ColonyOperations.AddDomain: {
        await handleAddDomainMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.EditDomain: {
        await handleEditDomainMotion(event, parsedAction, gasEstimate);
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

      case ColonyOperations.MakeArbitraryTransactions: {
        await handleMakeArbitraryTransactionsMotion(
          event,
          parsedAction,
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

      case ColonyOperations.EditColonyByDelta: {
        await handleMetadataDeltaMotion(event, parsedAction, gasEstimate);
        break;
      }

      case ColonyOperations.CancelExpenditureViaArbitration: {
        await handleCancelExpenditureViaArbitrationMotion(
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
