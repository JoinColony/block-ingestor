import { mutate, query } from '~amplifyClient';
import {
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
  GetColonyExtensionByHashAndColonyDocument,
  GetColonyExtensionByHashAndColonyQuery,
  GetColonyExtensionByHashAndColonyQueryVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { extensionId: extensionHash, colony, version } = event.args;
  const convertedVersion = toNumber(version);

  verbose(
    'Extension:',
    extensionHash,
    'upgraded to version',
    convertedVersion,
    'in Colony:',
    colony,
  );

  const { data } =
    (await query<
      GetColonyExtensionByHashAndColonyQuery,
      GetColonyExtensionByHashAndColonyQueryVariables
    >(GetColonyExtensionByHashAndColonyDocument, {
      extensionHash,
      colonyAddress: colony,
    })) ?? {};

  const extensionId = data?.listColonyExtensions?.items[0]?.id;

  if (extensionId) {
    await mutate<
      UpdateColonyExtensionByAddressMutation,
      UpdateColonyExtensionByAddressMutationVariables
    >(UpdateColonyExtensionByAddressDocument, {
      input: {
        id: extensionId,
        colonyId: colony,
        hash: extensionHash,
        version: convertedVersion,
      },
    });
  }
};
