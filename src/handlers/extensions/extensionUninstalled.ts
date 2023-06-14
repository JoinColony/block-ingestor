import { ContractEvent, ContractEventsSignatures } from '~types';
import { deleteExtensionFromEvent, removeMotionListeners } from '~utils';
import { removeEventListener } from '~eventListeners';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: extensionAddress,
    args: { colony: colonyAddress },
  } = event;

  await deleteExtensionFromEvent(event);
  removeEventListener(
    ContractEventsSignatures.ExtensionUninstalled,
    extensionAddress,
  );
  removeMotionListeners(colonyAddress);
};
