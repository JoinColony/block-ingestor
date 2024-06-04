import { BigNumber, constants } from 'ethers';
import { ExtensionEventListener } from '~eventListeners';

import { EventHandler, MotionEvents } from '~types';
import { getVotingClient } from '~utils';
import { linkPendingMetadata } from '~utils/colonyMetadata';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
  getMessageKey,
} from '../helpers';

import {
  getStakerReward,
  updateColonyUnclaimedStakes,
  updateAmountToExcludeNetworkFee,
} from './helpers';

export const handleMotionFinalized: EventHandler = async (event, listener) => {
  const {
    logIndex,
    transactionHash,
    args: { motionId, action },
    blockNumber,
    timestamp,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

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
      await linkPendingMetadata(
        action,
        colonyAddress,
        finalizedMotion.id,
        false,
      );
      await updateAmountToExcludeNetworkFee(
        action,
        colonyAddress,
        finalizedMotion,
      );
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
