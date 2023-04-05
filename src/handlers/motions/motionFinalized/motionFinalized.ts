import { ContractEvent } from '~types';
import { getVotingClient } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';
import { getStakerReward } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { motionId },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const finalizedMotion = await getMotionFromDB(
    colonyAddress,
    motionDatabaseId,
  );
  if (finalizedMotion) {
    const {
      motionData: { usersStakes },
      motionData,
    } = finalizedMotion;

    const updatedStakerRewards = await Promise.all(
      usersStakes.map(
        async ({ address: userAddress }) =>
          await getStakerReward(motionId, userAddress, colonyAddress),
      ),
    );

    const updatedMotionData = {
      ...motionData,
      stakerRewards: updatedStakerRewards,
      isFinalized: true,
    };

    await updateMotionInDB(finalizedMotion.id, updatedMotionData);
  }
};
