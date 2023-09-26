import { removeExtensionEventListeners } from '~eventListeners';
import { ContractEvent } from '~types';
import { deleteExtensionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;

  await deleteExtensionFromEvent(event);
  removeExtensionEventListeners(extensionAddress);
};
