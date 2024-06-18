import { utils } from 'ethers';
import { ExtensionEventListener } from '~eventListeners';
import { ColonyOperations, EventHandler } from '~types';
import {
  getCachedColonyClient,
  getMultiSigClient,
  getOneTxPaymentClient,
  getStagedExpenditureClient,
  getStakedExpenditureClient,
  parseMotionAction,
  verbose,
} from '~utils';
import {
  handleEditColonyMultiSig,
  handleMetadataDeltaMultiSig,
  handleManageReputationMultiSig,
  handleMintTokensMultiSig,
  handleMoveFundsMultiSig,
  handleSetUserRolesMultiSig,
  handleUnlockTokenMultiSig,
  handleAddOrEditDomainMultiSig,
  handleColonyVersionUpgrade,
} from './handlers';
import { handlePaymentMultiSig } from './handlers/payment';

export const handleMultiSigMotionCreated: EventHandler = async (
  event,
  listener,
) => {
  const {
    args: { motionId },
    blockNumber,
  } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const multiSigClient = await getMultiSigClient(colonyAddress);
  const oneTxPaymentClient = await getOneTxPaymentClient(colonyAddress);

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  const stagedExpenditureClient = await getStagedExpenditureClient(
    colonyAddress,
  );

  if (!colonyClient || !multiSigClient) {
    return;
  }

  const motion = await multiSigClient.getMotion(motionId, {
    blockTag: blockNumber,
  });

  const actionData = motion.data[0];
  const actionTarget = motion.targets[0];

  if (!actionData) {
    verbose(`No action data in multiSig motion: ${motionId}`);
  }

  /**
   * @NOTE: This is not good, we should use ABIs from @colony/abis instead.
   * It would avoid having to make network calls each time the motion is created
   */
  const interfaces = [
    colonyClient.interface,
    oneTxPaymentClient?.interface,
    stakedExpenditureClient?.interface,
    stagedExpenditureClient?.interface,
  ].filter(Boolean) as utils.Interface[]; // Casting seems necessary as TS does not pick up the .filter()

  const parsedOperation = parseMotionAction(actionData, interfaces);

  if (parsedOperation) {
    const contractOperation = parsedOperation.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.EditColony: {
        await handleEditColonyMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleManageReputationMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }
      case ColonyOperations.EmitDomainReputationReward: {
        await handleManageReputationMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }
      case ColonyOperations.MintTokens: {
        await handleMintTokensMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMultiSig(
          colonyAddress,
          event,
          parsedOperation,
          actionTarget,
        );
        break;
      }
      case ColonyOperations.AddDomain:
      case ColonyOperations.EditDomain: {
        await handleAddOrEditDomainMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }
      case ColonyOperations.EditColonyByDelta: {
        await handleMetadataDeltaMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }
      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.Upgrade: {
        await handleColonyVersionUpgrade(colonyAddress, event, parsedOperation);
        break;
      }
      default: {
        break;
      }
    }

    verbose(`${contractOperation} MultiSig Created`);
  }
};
