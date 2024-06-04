import { BigNumber } from 'ethers';
import { BlockTag } from '@ethersproject/abstract-provider';
import { AnyVotingReputationClient } from '@colony/colony-js';

import { MotionVote } from '~types';
import { getColonyFromDB } from '~utils';
import { mutate } from '~amplifyClient';
import { StakerReward, UpdateColonyDocument } from '~graphql';

export const getStakerReward = async (
  motionId: string,
  userAddress: string,
  votingReputationClient: AnyVotingReputationClient,
  blockNumber: BlockTag = 'latest',
): Promise<StakerReward> => {
  /*
   * If **anyone** staked on a side, calling the rewards function returns 0 if there's no reward (even for
   * a user who didnd't stake).
   *
   * But calling the rewards function on a side where **no one** has voted
   * will result in an error being thrown.
   *
   * Hence the try/catch.
   */
  let stakingRewardYay = BigNumber.from(0);
  let stakingRewardNay = BigNumber.from(0);
  try {
    [stakingRewardYay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      MotionVote.YAY,
      { blockTag: blockNumber },
    );
  } catch (error) {
    // We don't care to catch the error since we fallback to it's initial value
  }
  try {
    [stakingRewardNay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      MotionVote.NAY,
      { blockTag: blockNumber },
    );
  } catch (error) {
    // silent error
  }

  return {
    address: userAddress,
    rewards: {
      nay: stakingRewardNay.toString(),
      yay: stakingRewardYay.toString(),
    },
    isClaimed: false,
  };
};

export const updateColonyUnclaimedStakes = async (
  colonyAddress: string,
  motionDatabaseId: string,
  updatedStakerRewards: StakerReward[],
): Promise<void> => {
  const colony = await getColonyFromDB(colonyAddress);
  if (colony) {
    /*
     * @NOTE: We only want to store unclaimed stakes that have a non-zero yay or nay reward.
     * Otherwise, they will show up as unclaimed stakes in the stakes tab, but will not be claimable.
     */
    const unclaimedRewards = updatedStakerRewards.filter(
      ({ rewards }) => rewards.yay !== '0' || rewards.nay !== '0',
    );
    const unclaimedMotionStake = {
      motionId: motionDatabaseId,
      unclaimedRewards,
    };

    let { motionsWithUnclaimedStakes } = colony;

    if (motionsWithUnclaimedStakes) {
      motionsWithUnclaimedStakes.push(unclaimedMotionStake);
    } else {
      motionsWithUnclaimedStakes = [unclaimedMotionStake];
    }

    await mutate(UpdateColonyDocument, {
      input: {
        id: colonyAddress,
        motionsWithUnclaimedStakes,
      },
    });
  }
};
