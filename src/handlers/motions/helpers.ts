import { BigNumber } from 'ethers';
import { mutate } from '~amplifyClient';
import { MotionData, MotionSide } from '~types';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(1) ? MotionSide.YAY : MotionSide.NAY;

export const updateMotionInDB = async (
  id: string,
  motionData: MotionData,
): Promise<void> => {
  await mutate('updateColonyAction', {
    input: {
      id,
      motionData,
    },
  });
};
