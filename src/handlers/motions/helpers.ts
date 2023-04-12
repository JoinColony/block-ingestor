import { BigNumber } from 'ethers';
import { MotionSide } from '~types';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(1) ? MotionSide.YAY : MotionSide.NAY;
