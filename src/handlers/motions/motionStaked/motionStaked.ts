import { ContractEvent } from '~types';
import { verbose } from '~utils';
import { getVotingClient } from '~utils/clients';
import { getMotionSide, getRequiredStake } from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { vote, amount, staker, motionId },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const { skillRep } = await votingClient.getMotion(motionId);

  const requiredStake = getRequiredStake(skillRep, totalStakeFraction);

  verbose(
    `User: ${staker} staked motion ${motionId} by ${amount.toString()} on side ${getMotionSide(
      vote,
    )}`,
  );
};
