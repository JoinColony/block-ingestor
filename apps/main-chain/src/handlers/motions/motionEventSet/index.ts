import { ExtensionEventListener, EventHandler } from '@joincolony/blocks';
import { getVotingClient } from '~utils';
import { getBlockChainTimestampISODate } from '~utils/dates';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';
import { verbose } from '@joincolony/utils';

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
          ? getBlockChainTimestampISODate(timestamp)
          : motion.motionStateHistory.allVotesSubmittedAt,
        allVotesRevealedAt: eventIndex.eq(2)
          ? getBlockChainTimestampISODate(timestamp)
          : motion.motionStateHistory.allVotesRevealedAt,
      },
    });
  }
  verbose(`Motion: ${motionId} has advanced from ${eventIndex}`);
};
