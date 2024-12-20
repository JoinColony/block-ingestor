import amplifyClient from '~amplifyClient';
import {
  GetColonyExtensionByHashAndColonyDocument,
  GetColonyExtensionByHashAndColonyQuery,
  GetColonyExtensionByHashAndColonyQueryVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import { toNumber } from '~utils';
import { updateExtension } from '~utils/extensions/updateExtension';
import { verbose } from '@joincolony/utils';

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
    (await amplifyClient.query<
      GetColonyExtensionByHashAndColonyQuery,
      GetColonyExtensionByHashAndColonyQueryVariables
    >(GetColonyExtensionByHashAndColonyDocument, {
      extensionHash,
      colonyAddress: colony,
    })) ?? {};

  const extensionId = data?.getExtensionByColonyAndHash?.items[0]?.id;

  if (extensionId) {
    await updateExtension(extensionId, { version: convertedVersion });
  }
};
