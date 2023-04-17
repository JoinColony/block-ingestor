import networkClient from '~networkClient';
import { ColonyOperations, ContractEvent } from '~types';
import { verbose } from '~utils';
import { getParsedActionFromMotion } from './helpers';
import {
  handleManageDomainMotion,
  handleMintTokensMotion,
  handleNetworkUpgradeMotion,
} from './handlers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { motionId },
  } = event;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const parsedAction = await getParsedActionFromMotion(motionId, colonyClient);

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

      default: {
        break;
      }
    }

    verbose(`${contractOperation} Motion Created`);
  }
};
