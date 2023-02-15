import { mutate } from '~/amplifyClient';
import { ContractEvent } from '~/types';
import { toNumber, verbose } from '~/utils';

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

  await mutate('updateColonyExtensionByColonyAndHash', {
    input: {
      colonyId: colony,
      hash: extensionHash,
      version: convertedVersion,
    },
  });
};
