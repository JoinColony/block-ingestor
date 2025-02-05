import amplifyClient from '~amplifyClient';
import {
  ExtensionFragment,
  GetColonyExtensionsByColonyAddressDocument,
  GetColonyExtensionsByColonyAddressQuery,
  GetColonyExtensionsByColonyAddressQueryVariables,
} from '@joincolony/graphql';
import { notNull } from '~utils/arrays';

export const getColonyExtensions = async (
  colonyAddress: string,
): Promise<ExtensionFragment[]> => {
  const response = await amplifyClient.query<
    GetColonyExtensionsByColonyAddressQuery,
    GetColonyExtensionsByColonyAddressQueryVariables
  >(GetColonyExtensionsByColonyAddressDocument, {
    colonyAddress,
  });

  const extensions =
    response?.data?.getExtensionByColonyAndHash?.items.filter(notNull) ?? [];
  return extensions;
};
