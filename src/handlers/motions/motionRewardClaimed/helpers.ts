import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  GetColonyStakeDocument,
  GetColonyStakeQuery,
  GetColonyStakeQueryVariables,
  StakerReward,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
  UpdateColonyStakeDocument,
  UpdateColonyStakeMutation,
  UpdateColonyStakeMutationVariables,
  UpdateUserStakeDocument,
  UpdateUserStakeMutation,
  UpdateUserStakeMutationVariables,
  UserMotionStakes,
} from '~graphql';
import { getColonyFromDB, output } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';

import { getColonyStakeId } from '../helpers';

export const getUpdatedStakerRewards = (
  stakerRewards: StakerReward[],
  stakerAddress: string,
): StakerReward[] =>
  stakerRewards.map((stakerReward) => {
    const { address } = stakerReward;

    if (address !== stakerAddress) {
      return stakerReward;
    }

    return {
      ...stakerReward,
      /*
       * This is safe because, from the front end,
       * we claim both sides (if there were rewards on both sides)
       * at the same time. Simply adding a flag lets us preserve the original values,
       * which is useful for displaying winnings in the Claim Widget.
       */
      isClaimed: true,
    };
  });

export const updateColonyUnclaimedStakes = async (
  colonyAddress: string,
  motionDatabaseId: string,
  updatedStakerRewards: StakerReward[],
): Promise<void> => {
  const colony = await getColonyFromDB(colonyAddress);
  if (colony) {
    const { motionsWithUnclaimedStakes } = colony;
    const motionWithUnclaimedStakes = motionsWithUnclaimedStakes?.find(
      ({ motionId }) => motionDatabaseId === motionId,
    );

    if (motionWithUnclaimedStakes) {
      const unclaimedRewards = updatedStakerRewards.filter(
        ({ isClaimed }) => !isClaimed,
      );

      /* If we still have some unclaimed stakes, update the array */
      if (unclaimedRewards.length) {
        motionWithUnclaimedStakes.unclaimedRewards = unclaimedRewards;
        await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
          UpdateColonyDocument,
          {
            input: {
              id: colonyAddress,
              motionsWithUnclaimedStakes,
            },
          },
        );
      } else {
        /* If there are no more unclaimed stakes, remove this motion from the array of
           motions with unclaimed stakes */
        const updatedMotionsWithUnclaimedStakes =
          motionsWithUnclaimedStakes?.filter(
            ({ motionId }) => motionDatabaseId !== motionId,
          );
        await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
          UpdateColonyDocument,
          {
            input: {
              id: colonyAddress,
              motionsWithUnclaimedStakes: updatedMotionsWithUnclaimedStakes,
            },
          },
        );
      }
    } else {
      output(
        `Unable to find unclaimed stake with a motion id: ${motionDatabaseId}. This is a bug and should be investigated.`,
      );
    }
  }
};

/**
 *
 * When a user claims their staker rewards, we need to subtract these rewards from
 * the record of the amount they've staked in the colony (their UserStake).
 *
 */
export const reclaimUserStake = async (
  userAddress: string,
  colonyAddress: string,
  reclaimAmount: BigNumber,
  motionTransactionHash: string,
): Promise<void> => {
  const colonyStakeId = getColonyStakeId(userAddress, colonyAddress);
  const { data } =
    (await query<GetColonyStakeQuery, GetColonyStakeQueryVariables>(
      GetColonyStakeDocument,
      {
        colonyStakeId,
      },
    )) ?? {};

  if (!data?.getColonyStake) {
    output(
      `Could not find user stake for user ${userAddress} in colony ${colonyAddress}. This is a bug and should be investigated.`,
    );
    return;
  }

  const totalAmount = data.getColonyStake.totalAmount;
  let updatedAmount = BigNumber.from(totalAmount).sub(reclaimAmount);

  // Should never be negative, but just in case.
  if (updatedAmount.isNegative()) {
    updatedAmount = BigNumber.from(0);
  }

  await mutate<UpdateColonyStakeMutation, UpdateColonyStakeMutationVariables>(
    UpdateColonyStakeDocument,
    {
      colonyStakeId,
      totalAmount: updatedAmount.toString(),
    },
  );

  // Update user stake status
  await mutate<UpdateUserStakeMutation, UpdateUserStakeMutationVariables>(
    UpdateUserStakeDocument,
    {
      input: {
        id: getUserStakeDatabaseId(userAddress, motionTransactionHash),
      },
    },
  );
};

export const getMotionUserStake = (
  usersStakes: UserMotionStakes[],
  userAddress: string,
): BigNumber => {
  const userStakes = usersStakes.find(({ address }) => address === userAddress);

  if (!userStakes) {
    output(
      `Could not find the stakes for user ${userAddress}. This is a bug and should be investigated.`,
    );
    return BigNumber.from(0);
  }

  return BigNumber.from(userStakes.stakes.raw.yay).add(
    userStakes.stakes.raw.nay,
  );
};
