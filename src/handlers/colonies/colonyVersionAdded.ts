import { COLONY_CURRENT_VERSION_KEY } from '~constants';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';
import { updateCurrentVersion } from '~utils/currentVersion';

export default async (event: ContractEvent): Promise<void> => {
  const { version } = event.args;
  const convertedVersion = toNumber(version);

  verbose('New colony version:', convertedVersion, 'added to network');

  await updateCurrentVersion(COLONY_CURRENT_VERSION_KEY, convertedVersion);
};
