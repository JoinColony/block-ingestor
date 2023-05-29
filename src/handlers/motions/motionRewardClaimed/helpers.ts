import { mutate } from '~amplifyClient';
import { getColonyFromDB } from '~utils';

export const updateColonyUnclaimedStakes = async (
  colonyAddress: string,
  motionId: string,
  staker: string,
): Promise<void> => {
  const colony = await getColonyFromDB(colonyAddress);
  const updatedUnclaimedStakes = colony?.unclaimedStakes?.map(
    (unclaimedStake) => {
      const { transactionHash } = unclaimedStake;

      if (motionId !== transactionHash) {
        return unclaimedStake;
      }

      /* Remove rewards that have been claimed by this staker */
      const updatedUnclaimedRewards = unclaimedStake?.unclaimedRewards.filter(
        ({ address }) => address !== staker,
      );

      return {
        ...unclaimedStake,
        unclaimedRewards: updatedUnclaimedRewards,
      };
    },
  );

  await mutate('updateColony', {
    input: {
      id: colonyAddress,
      unclaimedStakes: updatedUnclaimedStakes,
    },
  });
};
