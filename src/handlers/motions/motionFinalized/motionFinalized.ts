import { BigNumber } from 'ethers';

import { ContractEvent } from '~types';
import { getVotingClient } from '~utils';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';

import { getStakerReward, linkPendingDomainMetadataWithDomain } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { motionId, action },
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

    const {
      revealedVotes: {
        raw: { yay: yayVotes, nay: nayVotes },
      },
      motionStakes: {
        percentage: { yay: yayPercentage, nay: nayPercentage },
      },
    } = motionData;
    const yayWon = BigNumber.from(yayVotes).gt(nayVotes) || (Number(yayPercentage) > Number(nayPercentage));

    if (finalizedMotion.pendingDomainMetadata && yayWon) {
      await linkPendingDomainMetadataWithDomain(action, colonyAddress, finalizedMotion);
    }

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
