import { BigNumber } from 'ethers';
import { MotionStakes } from '~types';

export const getRequiredStake = (
  skillRep: BigNumber,
  totalStakeFraction: BigNumber,
): BigNumber =>
  skillRep.mul(totalStakeFraction).div(BigNumber.from(10).pow(18));

export const getMotionStakes = (
  requiredStake: BigNumber,
  [totalNayStakesRaw, totalYayStakesRaw]: [BigNumber, BigNumber],
): MotionStakes => {
  const totalYayStakesPercentage = BigNumber.from(totalYayStakesRaw)
    .div(requiredStake)
    .mul(100);

  const totalNayStakesPercentage = BigNumber.from(totalNayStakesRaw)
    .div(requiredStake)
    .mul(100);

  const motionStakes: MotionStakes = {
    raw: {
      yay: totalYayStakesRaw.toString(),
      nay: totalNayStakesRaw.toString(),
    },
    percentage: {
      yay: totalYayStakesPercentage.toString(),
      nay: totalNayStakesPercentage.toString(),
    },
  };

  return motionStakes;
};
