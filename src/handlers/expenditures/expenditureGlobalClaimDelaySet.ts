import { mutate } from '~amplifyClient';
import {
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { toNumber } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { globalClaimDelay } = event.args;
  const convertedGlobalClaimDelay = toNumber(globalClaimDelay);

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
