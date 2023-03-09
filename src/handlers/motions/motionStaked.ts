import { query } from '~amplifyClient';
import { ContractEvent, MotionQuery } from '~types';
import { verbose, getRequiredStake } from '~utils';
import { getMotionSide, updateMotionStakeInDB } from './helpers';

export default async (event: ContractEvent) => {
  const {
    contractAddress: colonyAddress,
    args: { vote, amount, staker, motionId: rawMotionId },
  } = event;

  const { items: motions }: { items: MotionQuery[] } = await query(
    'getColonyMotions',
    {
      colonyAddress,
    },
  );

  const stakedMotion = motions.find(
    ({ motionData: { motionId } }) => motionId === rawMotionId.toString(),
  );

  if (stakedMotion) {
    const { skillRep } = stakedMotion.motionData;
    const requiredStake = await getRequiredStake(colonyAddress, skillRep);
    await updateMotionStakeInDB(
      stakedMotion,
      vote,
      amount,
      staker,
      requiredStake,
    );

    verbose(
      `User: ${staker} staked motion with tx hash: ${
        stakedMotion.id
      } by ${amount.toString()} on side ${getMotionSide(vote)}`,
    );
  }
};
