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
  getStakerReward,
  linkPendingMetadata,
} from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    logIndex,
    transactionHash,
    args: { motionId, action },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
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
    }

    const updatedStakerRewards = await Promise.all(
      usersStakes.map(
        async ({ address: userAddress }) =>
          await getStakerReward(motionId, userAddress, colonyAddress),
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
    };

    await updateMotionInDB(updatedMotionData, newMotionMessages);
  }
};
