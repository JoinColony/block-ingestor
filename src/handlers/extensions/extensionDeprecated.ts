import { mutate, query } from '~amplifyClient';
import {
  GetColonyExtensionByHashAndColonyDocument,
  GetColonyExtensionByHashAndColonyQuery,
  GetColonyExtensionByHashAndColonyQueryVariables,
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { extensionId: extensionHash, colony, deprecated } = event.args;

  verbose(
    'Extension:',
    extensionHash,
    deprecated ? 'deprecated' : 're-enabled',
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
        isDeprecated: deprecated,
      },
    });
  }
};
