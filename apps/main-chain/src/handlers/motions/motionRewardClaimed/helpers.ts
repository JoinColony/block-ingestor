import amplifyClient from '~amplifyClient';
import {
  StakerReward,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
  UpdateUserStakeDocument,
  UpdateUserStakeMutation,
  UpdateUserStakeMutationVariables,
} from '@joincolony/graphql';
import { getColonyFromDB } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';
import { output } from '@joincolony/utils';

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
        await amplifyClient.mutate<
          UpdateColonyMutation,
          UpdateColonyMutationVariables
        >(UpdateColonyDocument, {
          input: {
            id: colonyAddress,
            motionsWithUnclaimedStakes,
          },
        });
      } else {
        /* If there are no more unclaimed stakes, remove this motion from the array of
           motions with unclaimed stakes */
        const updatedMotionsWithUnclaimedStakes =
          motionsWithUnclaimedStakes?.filter(
            ({ motionId }) => motionDatabaseId !== motionId,
          );
        await amplifyClient.mutate<
          UpdateColonyMutation,
          UpdateColonyMutationVariables
        >(UpdateColonyDocument, {
          input: {
            id: colonyAddress,
            motionsWithUnclaimedStakes: updatedMotionsWithUnclaimedStakes,
          },
        });
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
  motionTransactionHash: string,
): Promise<void> => {
  // Update user stake status
  await amplifyClient.mutate<
    UpdateUserStakeMutation,
    UpdateUserStakeMutationVariables
  >(UpdateUserStakeDocument, {
    input: {
      id: getUserStakeDatabaseId(userAddress, motionTransactionHash),
      isClaimed: true,
    },
  });
};
