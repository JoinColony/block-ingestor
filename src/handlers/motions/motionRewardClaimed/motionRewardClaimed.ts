import { ContractEvent, MotionEvents } from '~types';
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
  getUserMotionStake,
} from './helpers';
import { ColonyMotion } from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const {
    colonyAddress,
    args: { motionId, staker },
    transactionHash,
    logIndex,
  } = event;

  if (!colonyAddress) {
    return;
  }

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
    const { stakerRewards, usersStakes } = claimedMotion;

    const userStake = getUserMotionStake(usersStakes, staker);
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
    await reclaimUserStake(
      staker,
      colonyAddress,
      userStake,
      updatedMotionData.transactionHash,
    );
  }
};
