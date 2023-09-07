import { Extension } from '@colony/colony-js';

import { ColonyOperations, ContractEvent } from '~types';
import { getCachedColonyClient, verbose } from '~utils';
import { getParsedActionFromMotion } from './helpers';
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

  if (!colonyClient) {
    return;
  }

  const oneTxPaymentClient = await colonyClient.getExtensionClient(
    Extension.OneTxPayment,
  );
  const parsedAction = await getParsedActionFromMotion(
    motionId,
    colonyAddress,
    [colonyClient, oneTxPaymentClient],
  );

  if (parsedAction) {
    const contractOperation = parsedAction.name;
    /* Handle the action type-specific mutation here */
    switch (contractOperation) {
      case ColonyOperations.MintTokens: {
        await handleMintTokensMotion(event, parsedAction);
        break;
      }
      case ColonyOperations.AddDomain:
      case ColonyOperations.EditDomain: {
        await handleManageDomainMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.Upgrade: {
        await handleNetworkUpgradeMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.UnlockToken: {
        await handleUnlockTokenMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.MakePaymentFundedFromDomain: {
        await handlePaymentMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.MoveFundsBetweenPots: {
        await handleMoveFundsMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.EmitDomainReputationReward:
      case ColonyOperations.EmitDomainReputationPenalty: {
        await handleDomainEditReputationMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.EditColony: {
        await handleEditColonyMotion(event, parsedAction);
        break;
      }

      case ColonyOperations.SetUserRoles: {
        await handleSetUserRolesMotion(event, parsedAction);
        break;
      }

      default: {
        break;
      }
    }

    verbose(`${contractOperation} Motion Created`);
  }
};
