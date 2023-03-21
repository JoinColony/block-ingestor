import { query } from '~amplifyClient';
import { ContractEvent, MotionQuery } from '~types';
import { verbose } from '~utils';
import { getVotingClient } from '~utils/clients';
import {
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
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
  const [remainingNayStake, remainingYayStake] = getRemainingStakes(
    requiredStake,
    stakes,
  );

  const { items: motions }: { items: MotionQuery[] } = await query(
    'getColonyMotions',
    {
      colonyAddress,
    },
  );

  verbose(
    `User: ${staker} staked motion ${motionId} by ${amount.toString()} on side ${getMotionSide(
      vote,
    )}`,
  );
};
