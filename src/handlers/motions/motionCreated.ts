import networkClient from '~networkClient';
import { ColonyOperations, ContractEvent } from '~types';
import {
  verbose,
  getParsedActionFromMotion,
  writeMintTokensMotionToDB,
} from '~utils';

export default async (event: ContractEvent) => {
  const {
    contractAddress: colonyAddress,
    args: { motionId },
  } = event;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const parsedAction = await getParsedActionFromMotion(motionId, colonyClient);

  if (parsedAction) {
    const contractOperation = parsedAction.name;

    /* Handle the action type-specific mutation here*/
    switch (contractOperation) {
      case ColonyOperations.MintTokens: {
        await writeMintTokensMotionToDB(event, parsedAction);
        break;
      }
      default: {
        break;
      }
    }

    verbose(`${contractOperation} Motion Created`);
  }
};
