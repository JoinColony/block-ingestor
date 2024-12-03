import { verbose } from '@joincolony/utils';
import { COLONY_CURRENT_VERSION_KEY } from '~constants';
import { ContractEvent } from '@joincolony/blocks';
import { toNumber } from '~utils';
import { updateCurrentVersion } from '~utils/currentVersion';
import { sendColonyVersionAddedNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { version } = event.args;
  const convertedVersion = toNumber(version);

  verbose('New colony version:', convertedVersion, 'added to network');

  const handleVersionUpdated = async (): Promise<void> => {
    await sendColonyVersionAddedNotifications(convertedVersion);
  };

  await updateCurrentVersion(
    COLONY_CURRENT_VERSION_KEY,
    convertedVersion,
    handleVersionUpdated,
  );
};
