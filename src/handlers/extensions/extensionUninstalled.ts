import { removeVotingReputationListeners } from '~eventListeners';
import { ContractEvent } from '~types';
import { deleteExtensionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;

  console.log('Extension uninstalled: ', event);

  await deleteExtensionFromEvent(event);
  removeVotingReputationListeners(extensionAddress);
};
