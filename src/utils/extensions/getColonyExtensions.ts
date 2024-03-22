import { query } from '~amplifyClient';
import {
  ExtensionFragment,
  GetColonyExtensionsByColonyAddressDocument,
  GetColonyExtensionsByColonyAddressQuery,
  GetColonyExtensionsByColonyAddressQueryVariables,
} from '~graphql';
import { notNull } from '~utils/arrays';

export const getColonyExtensions = async (
  colonyAddress: string,
): Promise<ExtensionFragment[]> => {
  const response = await query<
    GetColonyExtensionsByColonyAddressQuery,
    GetColonyExtensionsByColonyAddressQueryVariables
  >(GetColonyExtensionsByColonyAddressDocument, {
    colonyAddress,
  });

  const extensions =
    response?.data?.getExtensionByColonyAndHash?.items.filter(notNull) ?? [];
  return extensions;
};
