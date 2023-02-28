import { mutate } from '~amplifyClient';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress } = event;
  const { newVersion } = event.args;
  const convertedVersion = toNumber(newVersion);

  verbose(
    'Colony:',
    contractAddress,
    `upgraded to version ${convertedVersion}`,
  );

  await mutate('updateColony', {
    input: {
      id: event.contractAddress,
      version: convertedVersion,
    },
  });
};
