import { ExtensionEventListener } from '~eventListeners';
import { EventHandler, MotionSide } from '~types';
import { verbose, getVotingClient } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
  getUpdatedUsersStakes,
  getUpdatedMessages,
  updateMotionInDB,
  getMessageKey,
  updateUserStake,
} from '../helpers';

export const handleMotionStaked: EventHandler = async (
  event,
  listener,
): Promise<void> => {
  const {
    logIndex,
    transactionHash,
    args: { vote, amount, staker, motionId },
    timestamp,
    blockNumber,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const totalStakeFraction = await votingClient.getTotalStakeFraction({
    blockTag: blockNumber,
  });
  const { skillRep, stakes } = await votingClient.getMotion(motionId, {
    blockTag: blockNumber,
  });

  const requiredStake = getRequiredStake(skillRep, totalStakeFraction);
  const motionStakes = getMotionStakes(requiredStake, stakes, vote);
  const remainingStakes = getRemainingStakes(requiredStake, stakes);
  const showInActionsList =
    Number(motionStakes.percentage.yay) + Number(motionStakes.percentage.nay) >=
    10;
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const stakedMotion = await getMotionFromDB(motionDatabaseId);

  if (stakedMotion) {
    const { usersStakes } = stakedMotion;

    const updatedUserStakes = getUpdatedUsersStakes(
      usersStakes,
      staker,
      vote,
      amount,
      requiredStake,
    );
    const newMotionMessages = getUpdatedMessages({
      motionData: stakedMotion,
      requiredStake,
      motionStakes,
      messageKey: getMessageKey(transactionHash, logIndex),
      vote,
      staker,
      amount,
    });

    const yaySideFullyStaked = requiredStake.eq(motionStakes.raw.yay);
    const naySideFullyStaked = requiredStake.eq(motionStakes.raw.nay);
    const stakerSide = getMotionSide(vote);

    await updateMotionInDB(
      {
        ...stakedMotion,
        usersStakes: updatedUserStakes,
        motionStakes,
        remainingStakes,
        motionStateHistory: {
          ...stakedMotion.motionStateHistory,
          yaySideFullyStakedAt:
            yaySideFullyStaked && stakerSide === MotionSide.YAY
              ? new Date(timestamp * 1000).toISOString()
              : stakedMotion.motionStateHistory.yaySideFullyStakedAt,
          naySideFullyStakedAt:
            naySideFullyStaked && stakerSide === MotionSide.NAY
              ? new Date(timestamp * 1000).toISOString()
              : stakedMotion.motionStateHistory.naySideFullyStakedAt,
        },
      },
      newMotionMessages,
      showInActionsList,
    );

    await updateUserStake(
      stakedMotion.transactionHash,
      staker,
      colonyAddress,
      amount,
      timestamp,
    );

    verbose(
      `User: ${staker} staked motion ${motionId.toString()} by ${amount.toString()} on side ${stakerSide}`,
    );
  }
};
