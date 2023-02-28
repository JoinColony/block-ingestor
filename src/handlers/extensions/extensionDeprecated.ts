import { mutate } from '~amplifyClient';
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

  await mutate('updateColonyExtensionByColonyAndHash', {
    input: {
      colonyId: colony,
      hash: extensionHash,
      isDeprecated: deprecated,
    },
  });
};
