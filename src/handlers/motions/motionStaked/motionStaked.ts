import { ContractEvent } from '~types';
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
  updateUserColonyStake,
  updateUserStake,
} from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    colonyAddress,
    logIndex,
    transactionHash,
    args: { vote, amount, staker, motionId },
    timestamp,
  } = event;

  if (!colonyAddress) {
    return;
  }

  await updateUserColonyStake(staker, colonyAddress, amount);

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const { skillRep, stakes } = await votingClient.getMotion(motionId);

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

    await updateMotionInDB(
      {
        ...stakedMotion,
        usersStakes: updatedUserStakes,
        motionStakes,
        remainingStakes,
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
      `User: ${staker} staked motion ${motionId.toString()} by ${amount.toString()} on side ${getMotionSide(
        vote,
      )}`,
    );
  }
};
