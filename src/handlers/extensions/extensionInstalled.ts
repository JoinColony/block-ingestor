import { setupListenersForExtension } from '~eventListeners';
import networkClient from '~networkClient';
import { ContractEvent } from '~types';
import { writeExtensionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { extensionId: extensionHash, colony } = event.args;
  const extensionAddress = await networkClient.getExtensionInstallation(
    extensionHash,
    colony,
  );

  await writeExtensionFromEvent(event, extensionAddress);
  setupListenersForExtension(extensionAddress, extensionHash, false);
};
