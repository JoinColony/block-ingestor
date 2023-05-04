import { ContractEvent, ColonyMotion, MotionEvents } from '~types';
import { getVotingClient } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
  getMessageKey,
} from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { motionId, staker },
    transactionHash,
    logIndex,
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const claimedMotion = await getMotionFromDB(motionDatabaseId);

  if (claimedMotion) {
    const {
      stakerRewards,
      messages,
    } = claimedMotion;

    const updatedStakerRewards = stakerRewards.map((stakerReward) => {
      const { address } = stakerReward;

      if (address !== staker) {
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

    const updatedMotionData: ColonyMotion = {
      ...claimedMotion,
      stakerRewards: updatedStakerRewards,
      messages: [
        ...messages,
        {
          name: MotionEvents.MotionRewardClaimed,
          messageKey: getMessageKey(transactionHash, logIndex),
          initiatorAddress: staker,
        },
      ],
    };

    await updateMotionInDB(updatedMotionData);
  }
};
