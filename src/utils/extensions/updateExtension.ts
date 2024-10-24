import { mutate } from '~amplifyClient';
import {
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
  UpdateColonyExtensionInput,
} from '~graphql';

export const updateExtension = async (
  extensionAddress: string,
  fieldsToUpdate: Omit<UpdateColonyExtensionInput, 'id'>,
): Promise<UpdateColonyExtensionByAddressMutation | undefined> => {
  const result = await mutate<
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
