import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { toNumber, verbose, writeActionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { newVersion, agent: initiatorAddress } = event.args;
  const convertedVersion = toNumber(newVersion);

  verbose('Colony:', colonyAddress, `upgraded to version ${convertedVersion}`);

  // Update colony version in the db
  await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
    UpdateColonyDocument,
    {
      input: {
        id: event.contractAddress,
        version: convertedVersion,
      },
    },
  );

  writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.VersionUpgrade,
    initiatorAddress,
    newColonyVersion: convertedVersion,
  });
};
