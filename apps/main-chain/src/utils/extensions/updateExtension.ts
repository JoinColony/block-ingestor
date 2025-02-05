import amplifyClient from '~amplifyClient';
import {
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
  UpdateColonyExtensionInput,
} from '@joincolony/graphql';

export const updateExtension = async (
  extensionAddress: string,
  fieldsToUpdate: Omit<UpdateColonyExtensionInput, 'id'>,
): Promise<UpdateColonyExtensionByAddressMutation | undefined> => {
  const result = await amplifyClient.mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      ...fieldsToUpdate,
    },
  });
  return result?.data;
};
