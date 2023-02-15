import { mutate } from '~/amplifyClient';
import { COLONY_CURRENT_VERSION_KEY } from '~/constants';
import { ContractEvent } from '~/types';
import { toNumber, verbose } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { version } = event.args;
  const convertedVersion = toNumber(version);

  verbose('New colony version:', convertedVersion, 'added to network');

  await mutate('setCurrentVersion', {
    input: {
      key: COLONY_CURRENT_VERSION_KEY,
      version: convertedVersion,
    },
  });
};
