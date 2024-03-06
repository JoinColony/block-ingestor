import { mutate } from '~amplifyClient';
import {
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { globalClaimDelay } = event.args;
  const convertedGlobalClaimDelay = globalClaimDelay.toString();

  await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
    UpdateColonyDocument,
    {
      input: {
        id: colonyAddress,
        expendituresGlobalClaimDelay: convertedGlobalClaimDelay,
      },
    },
  );
};
