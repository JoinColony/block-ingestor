import { ColonyOperations } from '~types';
import {
  getCachedColonyClient,
  getMultiSigClient,
  getOneTxPaymentClient,
  getStagedExpenditureClient,
  getStakedExpenditureClient,
  parseMotionAction,
} from '~utils';
import { handleMultisigMultipleFunctions } from './multipleFunctions';
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
  handlePaymentMultiSig,
  handleMakeArbitraryTxsMultiSig,
} from './handlers/index';
import { sendMultisigActionNotifications } from '~utils/notifications';
import { NotificationCategory } from '~types/notifications';
import { utils } from 'ethers';
import { NotificationType } from '@joincolony/graphql';
import { verbose } from '@joincolony/utils';
import {
  EventHandler,
  ExtensionEventListener,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import networkClient from '~networkClient';
import { handleCreateProxyColonyMultiSig } from './handlers/proxyColonies/createProxyColony';

export const handleMultiSigMotionCreated: EventHandler = async (
  event,
  listener,
) => {
  const { colonyAddress } = listener as ExtensionEventListener;

  const {
    args: { motionId, agent: initiatorAddress },
    blockNumber,
    transactionHash,
  } = event;

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const multiSigClient = await getMultiSigClient(colonyAddress);

  if (!colonyClient || !multiSigClient) {
    return;
  }

  const oneTxPaymentClient = await getOneTxPaymentClient(colonyAddress);

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  const stagedExpenditureClient = await getStagedExpenditureClient(
    colonyAddress,
  );

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

  const motion = await multiSigClient.getMotion(motionId, {
    blockTag: blockNumber,
  });

  const actions = motion.data;
  const actionTargets = motion.targets;

  if (!actions[0]) {
    verbose(`No action data in multiSig motion: ${motionId}`);
    return;
  }

  let notificationCategory: NotificationCategory | null;
  // the motion data and targets are the same length as it's enforced on the contracts so we can check whichever
  if (actions.length === 1) {
    const actionData = actions[0];
    const actionTarget = actionTargets[0];

    const parsedOperation = parseMotionAction(actionData, interfaces);
    if (!parsedOperation) {
      return;
    }

    const contractOperation = parsedOperation.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.EditColony: {
        await handleEditColonyMultiSig(colonyAddress, event, parsedOperation);
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleManageReputationMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.EmitDomainReputationReward: {
        await handleManageReputationMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.MintTokens: {
        await handleMintTokensMultiSig(colonyAddress, event, parsedOperation);
        notificationCategory = NotificationCategory.Payment;
        break;
      }
      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMultiSig(colonyAddress, event, parsedOperation);
        // @NOTE, an edge case can occur if we are funding an expenditure with only 1 recipient, this will get called
        // so we handle notifications there specifically
        notificationCategory = null;
        break;
      }
      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMultiSig(colonyAddress, event, parsedOperation);
        notificationCategory = NotificationCategory.Payment;
        break;
      }
      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMultiSig(
          colonyAddress,
          event,
          parsedOperation,
          actionTarget,
        );
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.AddDomain:
      case ColonyOperations.EditDomain: {
        await handleAddOrEditDomainMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.EditColonyByDelta: {
        await handleMetadataDeltaMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMultiSig(colonyAddress, event, parsedOperation);
        notificationCategory = NotificationCategory.Payment;
        break;
      }
      case ColonyOperations.Upgrade: {
        await handleColonyVersionUpgrade(colonyAddress, event, parsedOperation);
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      case ColonyOperations.MakeArbitraryTransactions: {
        await handleMakeArbitraryTxsMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        break;
      }
      case ColonyOperations.CreateProxyColony: {
        await handleCreateProxyColonyMultiSig(
          colonyAddress,
          event,
          parsedOperation,
        );
        notificationCategory = NotificationCategory.Admin;
        break;
      }
      default: {
        notificationCategory = null;
        break;
      }
    }

    if (notificationCategory) {
      sendMultisigActionNotifications({
        colonyAddress,
        creator: initiatorAddress,
        notificationCategory,
        notificationType: NotificationType.MultisigActionCreated,
        transactionHash,
      });
    }

    verbose(`${contractOperation} MultiSig Created`);
  } else {
    await handleMultisigMultipleFunctions({
      event,
      colonyAddress,
      actionData: actions,
      actionTargets,
    });
  }
};
