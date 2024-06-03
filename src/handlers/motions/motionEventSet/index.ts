import { ExtensionEventListener } from '~eventListeners';
import { EventHandler } from '~types';
import { verbose, getVotingClient } from '~utils';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';

export const handleMotionEventSet: EventHandler = async (event, listener) => {
  const {
    args: { motionId, eventIndex },
    timestamp,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const motion = await getMotionFromDB(motionDatabaseId);

  if (motion) {
    await updateMotionInDB({
      ...motion,
      motionStateHistory: {
        ...motion.motionStateHistory,
        allVotesSubmittedAt: eventIndex.eq(1)
          ? new Date(timestamp * 1000).toISOString()
          : motion.motionStateHistory.allVotesSubmittedAt,
        allVotesRevealedAt: eventIndex.eq(2)
          ? new Date(timestamp * 1000).toISOString()
          : motion.motionStateHistory.allVotesRevealedAt,
      },
    });
  }
  verbose(`Motion: ${motionId} has advanced from ${eventIndex}`);
};
