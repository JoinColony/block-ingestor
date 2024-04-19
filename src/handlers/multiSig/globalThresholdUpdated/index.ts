import { mutate } from '~amplifyClient';
import {
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: multiSigAddress } = event;
  const { globalThreshold } = event.args;

  await mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: multiSigAddress,
      params: {
        multiSig: {
          colonyThreshold: globalThreshold.toNumber(),
        },
      },
    },
  });
};
