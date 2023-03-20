import { Extension, getExtensionHash } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '~types';
import { addMotionEventListener, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;

  verbose('Extension with address:', extensionAddress, 'was enabled');

  const {
    data: {
      updateColonyExtension: { extensionHash, colonyAddress },
    },
  } = await mutate('updateColonyExtensionByAddress', {
    input: {
      id: extensionAddress,
      isInitialized: true,
    },
  });

  /* Listen for motions once Voting Reputation is enabled. */
  if (getExtensionHash(Extension.VotingReputation) === extensionHash) {
    await addMotionEventListener(
      ContractEventsSignatures.MotionCreated,
      colonyAddress,
    );
  }
};
