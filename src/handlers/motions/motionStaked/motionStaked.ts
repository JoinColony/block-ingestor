import { ContractEvent } from '~types';
import { verbose, getVotingClient, getMotionDatabaseId } from '~utils';
import {
  getMotionFromDB,
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
  getUpdatedUsersStakes,
  updateMotionInDB,
} from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { vote, amount, staker, motionId },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const { skillRep, stakes } = await votingClient.getMotion(motionId);

  const requiredStake = getRequiredStake(skillRep, totalStakeFraction);
  const motionStakes = getMotionStakes(requiredStake, stakes);
  const remainingStakes = getRemainingStakes(requiredStake, stakes);

  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const stakedMotion = await getMotionFromDB(colonyAddress, motionDatabaseId);

  if (stakedMotion) {
    const {
      id,
      motionData: { usersStakes },
      motionData,
    } = stakedMotion;

    const updatedUserStakes = getUpdatedUsersStakes(
      usersStakes,
      staker,
      vote,
      amount,
      requiredStake,
    );

    await updateMotionInDB(id, {
      ...motionData,
      usersStakes: updatedUserStakes,
      motionStakes,
      remainingStakes,
    });

    verbose(
      `User: ${staker} staked motion ${motionId.toString()} by ${amount.toString()} on side ${getMotionSide(
        vote,
      )}`,
    );
  }
};
