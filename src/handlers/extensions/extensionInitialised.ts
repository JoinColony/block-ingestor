import { Extension, getExtensionHash } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  addMotionEventListener,
  verbose,
  writeVotingReputationInitParamsToDB,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;

  verbose('Extension with address:', extensionAddress, 'was enabled');

  const {
    data: {
      updateColonyExtension: { id, extensionHash, colonyAddress },
    },
  } = await mutate('updateColonyExtensionByAddress', {
    input: {
      id: extensionAddress,
      isInitialized: true,
    },
  });

  /* Listen for motions once Voting Reputation is enabled.*/
  if (getExtensionHash(Extension.VotingReputation) === extensionHash) {
    await addMotionEventListener(
      ContractEventsSignatures.MotionCreated,
      colonyAddress,
    );

    /* Add Voting Extension Initialisation Params to DB for access by motions */
    await writeVotingReputationInitParamsToDB(id, colonyAddress);
  }
};
