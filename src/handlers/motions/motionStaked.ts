import { ContractEvent } from '~types';
import { verbose } from '~utils';
import { getMotionSide } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    args: { vote, amount, staker, motionId },
  } = event;

  verbose(
    `User: ${staker} staked motion ${motionId} by ${amount.toString()} on side ${getMotionSide(
      vote,
    )}`,
  );
};
