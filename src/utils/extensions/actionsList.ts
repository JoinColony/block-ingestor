import { query } from '~amplifyClient';
import {
  GetColonyExtensionsByColonyAddressDocument,
  GetColonyExtensionsByColonyAddressQuery,
  GetColonyExtensionsByColonyAddressQueryVariables,
} from '~graphql';
import { notNull } from '~utils/arrays';

export const getExtensionInstallations = async (
  colonyAddress: string,
): Promise<string[]> => {
  const { data } =
    (await query<
      GetColonyExtensionsByColonyAddressQuery,
      GetColonyExtensionsByColonyAddressQueryVariables
    >(GetColonyExtensionsByColonyAddressDocument, {
      colonyAddress,
    })) ?? {};
  return (
    data?.getExtensionByColonyAndHash?.items
      .filter(notNull)
      .map((colonyExtension) => colonyExtension.id) ?? []
  );
};
