import { motionSpecificEventsListener } from '~eventListener';
import networkClient from '~networkClient';
import { ColonyOperations, ContractEvent } from '~types';
import {
  verbose,
  extractDataFromMotion,
  writeMintTokensMotionToDB,
} from '~utils';

export default async (event: ContractEvent) => {
  const {
    contractAddress: colonyAddress,
    args: { motionId },
  } = event;

  try {
    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    const motionData = await extractDataFromMotion(
      motionId,
      colonyClient,
      colonyAddress,
    );

    const contractOperation = motionData.parsedAction.name;

    /* Handle the action type-specific mutation here*/
    switch (contractOperation) {
      case ColonyOperations.MintTokens: {
        await writeMintTokensMotionToDB(event, motionData);
        break;
      }
      default: {
        break;
      }
    }
    verbose(`${contractOperation} Motion Created`);

    await motionSpecificEventsListener(colonyAddress);
  } catch {
    verbose('Unable to create Motion.');
  }
};
