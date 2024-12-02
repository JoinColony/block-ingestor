import {
  GetColonyExtensionDocument,
  GetColonyExtensionQuery,
  GetColonyExtensionQueryVariables,
} from '@joincolony/graphql';
import amplifyClient from '~amplifyClient';

export const isAddressExtension = async (address: string): Promise<boolean> => {
  const response = await amplifyClient.query<
    GetColonyExtensionQuery,
    GetColonyExtensionQueryVariables
  >(GetColonyExtensionDocument, {
    id: address,
  });

  return !!response?.data?.getColonyExtension;
};
