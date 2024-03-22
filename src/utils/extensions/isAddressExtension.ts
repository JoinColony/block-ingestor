import {
  GetColonyExtensionDocument,
  GetColonyExtensionQuery,
  GetColonyExtensionQueryVariables,
} from '~graphql';
import { query } from '~amplifyClient';

export const isAddressExtension = async (address: string): Promise<boolean> => {
  const response = await query<
    GetColonyExtensionQuery,
    GetColonyExtensionQueryVariables
  >(GetColonyExtensionDocument, {
    id: address,
  });

  return !!response?.data?.getColonyExtension;
};
