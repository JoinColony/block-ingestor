import { ExtensionEventListener } from '~eventListeners';
import { ColonyOperations, EventHandler } from '~types';
import {
  getCachedColonyClient,
  getMultiSigClient,
  getOneTxPaymentClient,
  getStagedExpenditureClient,
  getStakedExpenditureClient,
  parseOperation,
  verbose,
} from '~utils';
import {
  handleEditColonyMultiSig,
  handleMetadataDeltaMultiSig,
  handleMintTokensMultiSig,
  handleMoveFundsMultiSig,
  handleSetUserRolesMultiSig,
  handleUnlockTokenMultiSig,
  handleAddOrEditDomainMultiSig,
} from './handlers';

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

  const parsedOperation = parseOperation(actionData, {
    colonyClient,
    oneTxPaymentClient,
    stakedExpenditureClient,
    stagedExpenditureClient,
  });

  if (parsedOperation) {
    const contractOperation = parsedOperation.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.EditColony: {
        await handleEditColonyMultiSig(colonyAddress, event, parsedOperation);
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
      default: {
        break;
      }
    }

    verbose(`${contractOperation} MultiSig Created`);
  }
};
