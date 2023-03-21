import { query } from '~amplifyClient';
import { ContractEvent, MotionQuery } from '~types';
import { verbose, getVotingClient } from '~utils';
import {
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
  getStakedMotion,
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

  const { items: motions }: { items: MotionQuery[] } = await query(
    'getColonyMotions',
    {
      colonyAddress,
    },
  );

  const stakedMotion = getStakedMotion(motions, motionId);

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
