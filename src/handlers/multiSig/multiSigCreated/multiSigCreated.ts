import { ExtensionEventListener } from '~eventListeners';
import { ColonyOperations, EventHandler } from '~types';
import {
  getCachedColonyClient,
  getMultiSigClient,
  getOneTxPaymentClient,
  getStagedExpenditureClient,
  getStakedExpenditureClient,
  parseOperation,
  SimpleTransactionDescription,
  verbose,
} from '~utils';
import {
  handleMintTokensMultiSig,
  handleSimpleDecisionMultiSig,
  handleUnlockTokenMultiSig,
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
      case ColonyOperations.MintTokens: {
        await handleMintTokensMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMultiSig(colonyAddress, event, parsedOperation);
        break;
      }
      case ColonyOperations.SimpleDecision: {
        await handleSimpleDecisionMultiSig(
          colonyAddress,
          event,
          parsedOperation as SimpleTransactionDescription,
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
