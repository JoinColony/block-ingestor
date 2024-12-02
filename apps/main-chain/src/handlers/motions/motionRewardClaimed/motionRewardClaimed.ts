import { MotionEvents } from '~types';
import { getVotingClient } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
  getMessageKey,
} from '../helpers';
import {
  updateColonyUnclaimedStakes,
  reclaimUserStake,
  getUpdatedStakerRewards,
} from './helpers';
import { ColonyMotion } from '@joincolony/graphql';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';

export const handleMotionRewardClaimed: EventHandler = async (
  event,
  listener,
): Promise<void> => {
  const {
    args: { motionId, staker },
    transactionHash,
    logIndex,
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
  const claimedMotion = await getMotionFromDB(motionDatabaseId);

  if (claimedMotion) {
    const { stakerRewards } = claimedMotion;

    const updatedStakerRewards = getUpdatedStakerRewards(stakerRewards, staker);

    const newMotionMessages = [
      {
        name: MotionEvents.MotionRewardClaimed,
        messageKey: getMessageKey(transactionHash, logIndex),
        initiatorAddress: staker,
        motionId: motionDatabaseId,
      },
    ];

    const updatedMotionData: ColonyMotion = {
      ...claimedMotion,
      stakerRewards: updatedStakerRewards,
    };

    await updateMotionInDB(updatedMotionData, newMotionMessages);
    await updateColonyUnclaimedStakes(
      colonyAddress,
      motionDatabaseId,
      updatedStakerRewards,
    );
    await reclaimUserStake(staker, updatedMotionData.transactionHash);
  }
};
