import { BigNumber } from 'ethers';
import amplifyClient from '~amplifyClient';
import {
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { globalClaimDelay } = event.args;
  const convertedGlobalClaimDelay = BigNumber.from(globalClaimDelay).toString();

  await amplifyClient.mutate<
    UpdateColonyMutation,
    UpdateColonyMutationVariables
  >(UpdateColonyDocument, {
    input: {
      id: colonyAddress,
      expendituresGlobalClaimDelay: convertedGlobalClaimDelay,
    },
  });
};
