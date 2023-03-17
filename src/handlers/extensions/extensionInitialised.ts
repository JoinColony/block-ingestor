import { Extension, getExtensionHash } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import { motionSpecificEventsListener } from '~eventListener';
import { EventProcessorContext } from '~eventProcessor';
import { ContractEvent } from '~types';
import {
  verbose,
  writeVotingReputationInitParamsToDB,
  RemoveListener,
} from '~utils';

export const EXTENSION_INITIALISED_MOTION_LISTENERS = 'extensionInitialised';

export default async (
  event: ContractEvent,
  context: EventProcessorContext,
): Promise<void> => {
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

  let removeMotionListeners: RemoveListener[] = [];
  /* Listen for motions once Voting Reputation is enabled. */
  if (getExtensionHash(Extension.VotingReputation) === extensionHash) {
    removeMotionListeners = await motionSpecificEventsListener(colonyAddress);

    /* Store remove listener functions in context, to be called when extension is uninstalled */
    context.removeListeners[colonyAddress] = {
      [EXTENSION_INITIALISED_MOTION_LISTENERS]: removeMotionListeners,
    };

    /* Add Voting Extension Initialisation Params to DB for access by motions */
    await writeVotingReputationInitParamsToDB(id, colonyAddress);
  }
};
