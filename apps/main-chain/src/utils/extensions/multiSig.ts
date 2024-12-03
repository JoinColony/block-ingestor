import { AnyMultisigPermissionsClient } from '@colony/colony-js';
import { mutate } from '~amplifyClient';
import {
  ExtensionParams,
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '@joincolony/graphql';
import { getMultiSigClient } from '~utils/clients';

const getInitialMultiSigParams = async (
  multiSigClient: AnyMultisigPermissionsClient,
): Promise<ExtensionParams> => {
  const colonyThreshold = await multiSigClient.getGlobalThreshold();

  return {
    multiSig: {
      colonyThreshold: colonyThreshold.toNumber(),
    },
  };
};

export const addMultiSigParamsToDB = async (
  extensionAddress: string,
  colonyAddress: string,
): Promise<void> => {
  const multiSigClient = await getMultiSigClient(colonyAddress);

  if (!multiSigClient) {
    return;
  }

  const params = await getInitialMultiSigParams(multiSigClient);
  await mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      params,
    },
  });
};
