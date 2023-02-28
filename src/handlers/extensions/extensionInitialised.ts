import { mutate } from '~amplifyClient';
import { ContractEvent } from '~types';
import { verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;

  verbose('Extension with address:', extensionAddress, 'was enabled');

  await mutate('updateColonyExtensionByAddress', {
    input: {
      id: extensionAddress,
      isInitialized: true,
    },
  });
};
