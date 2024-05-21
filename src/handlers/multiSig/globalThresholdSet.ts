import { mutate, query } from '~amplifyClient';
import {
  GetColonyExtensionByAddressDocument,
  GetColonyExtensionByAddressQuery,
  GetColonyExtensionByAddressQueryVariables,
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: multiSigAddress } = event;
  const { globalThreshold } = event.args;

  const colonyExtensionsResponse = await query<
    GetColonyExtensionByAddressQuery,
    GetColonyExtensionByAddressQueryVariables
  >(GetColonyExtensionByAddressDocument, {
    extensionAddress: multiSigAddress,
  });

  const { multiSig } =
    colonyExtensionsResponse?.data?.getColonyExtension?.params ?? {};

  let colonyDomains;

  if (multiSig) {
    colonyDomains = [...(multiSig.domainThresholds ?? [])];
  }

  await mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: multiSigAddress,
      params: {
        multiSig: {
          colonyThreshold: globalThreshold.toNumber(),
          domainThresholds: colonyDomains,
        },
      },
    },
  });
};
