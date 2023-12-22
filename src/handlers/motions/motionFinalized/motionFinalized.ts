import { BigNumber, constants } from 'ethers';

import { ContractEvent, MotionEvents } from '~types';
import { getVotingClient } from '~utils';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
  getMessageKey,
} from '../helpers';

import {
  claimExpenditurePayouts,
  getStakerReward,
  linkPendingMetadata,
  updateColonyUnclaimedStakes,
} from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    colonyAddress,
    logIndex,
    transactionHash,
    args: { motionId, action },
    blockNumber,
    timestamp,
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
  const finalizedMotion = await getMotionFromDB(motionDatabaseId);
  if (finalizedMotion) {
    const {
      usersStakes,
      revealedVotes: {
        raw: { yay: yayVotes, nay: nayVotes },
      },
      motionStakes: {
        percentage: { yay: yayPercentage, nay: nayPercentage },
      },
    } = finalizedMotion;

    const yayWon =
      BigNumber.from(yayVotes).gt(nayVotes) ||
      Number(yayPercentage) > Number(nayPercentage);

    if (yayWon) {
      await linkPendingMetadata(action, colonyAddress, finalizedMotion);
      await claimExpenditurePayouts(action, colonyAddress);
    }

    const updatedStakerRewards = await Promise.all(
      usersStakes.map(
        async ({ address: userAddress }) =>
          await getStakerReward(
            motionId,
            userAddress,
            votingClient,
            blockNumber,
          ),
      ),
    );

    const newMotionMessages = [
      {
        initiatorAddress: constants.AddressZero,
        name: MotionEvents.MotionFinalized,
        messageKey: getMessageKey(transactionHash, logIndex),
        motionId: motionDatabaseId,
      },
    ];

    const updatedMotionData = {
      ...finalizedMotion,
      stakerRewards: updatedStakerRewards,
      isFinalized: true,
      motionStateHistory: {
        ...finalizedMotion.motionStateHistory,
        finalizedAt: new Date(timestamp * 1000).toISOString(),
      },
    };

    await updateMotionInDB(updatedMotionData, newMotionMessages);

    await updateColonyUnclaimedStakes(
      colonyAddress,
      motionDatabaseId,
      updatedStakerRewards,
    );
  }
};
