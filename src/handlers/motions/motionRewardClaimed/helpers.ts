import { mutate } from '~amplifyClient';
import {
  StakerReward,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { getColonyFromDB } from '~utils';

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
      console.log(
        `Unable to find unclaimed stake with a motion id: ${motionDatabaseId}. This is a bug and should be investigated.`,
      );
    }
  }
};
