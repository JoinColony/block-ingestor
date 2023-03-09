import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { mutate } from '~amplifyClient';
import { MotionQuery, MotionSide, UserStake } from '~types';
import { convertStakeToPercentage } from '~utils';

const getUpdatedUserStakesAmount = (
  existingAmount: string,
  amount: BigNumber,
) => BigNumber.from(existingAmount).add(amount).toString();

const getUpdatedUserStake = (
  userStake: UserStake,
  side: MotionSide,
  amount: BigNumber,
) => {
  const existingAmount = userStake.stakes.raw[side];
  userStake.stakes.raw[side] = getUpdatedUserStakesAmount(
    existingAmount,
    amount,
  );
  return userStake;
};

const getUserStakesMapFn =
  (staker: string, vote: BigNumber, amount: BigNumber) =>
  (userStake: UserStake) => {
    const { address } = userStake;
    if (address === staker) {
      return getUpdatedUserStake(userStake, getMotionSide(vote), amount);
    }

    return userStake;
  };

const getUpdatedUsersStakes = (
  usersStakes: UserStake[],
  staker: string,
  vote: BigNumber,
  amount: BigNumber,
) => {
  const isExistingStaker = usersStakes.some(
    ({ address }) => address === staker,
  );
  if (isExistingStaker) {
    const updateUserStakes = getUserStakesMapFn(staker, vote, amount);
    return usersStakes.map(updateUserStakes);
  }

  const invertedVote = BigNumber.from(1).sub(vote);
  const newUserStake = {
    address: staker,
    stakes: {
      raw: {
        [getMotionSide(vote)]: amount.toString(),
        [getMotionSide(invertedVote)]: '0',
      },
    },
  };

  return [...usersStakes, newUserStake];
};

const getUpdatedMotionStakes = (
  motionStakes: MotionQuery['motionData']['motionStakes'],
  vote: BigNumber,
  amount: BigNumber,
  requiredStake: Decimal,
) => {
  const currentAmount = motionStakes.raw[getMotionSide(vote)];
  const updatedAmount = new Decimal(currentAmount).add(amount.toString());
  const updatedPercentage = convertStakeToPercentage(
    updatedAmount,
    requiredStake,
  );
  return {
    raw: {
      ...motionStakes.raw,
      [getMotionSide(vote)]: updatedAmount.toString(),
    },
    percentage: {
      ...motionStakes.percentage,
      [getMotionSide(vote)]: updatedPercentage,
    },
  };
};

const getUpdatedMotionData = (
  motionData: MotionQuery['motionData'],
  vote: BigNumber,
  amount: BigNumber,
  staker: string,
  requiredStake: Decimal,
) => {
  const { motionStakes, usersStakes } = motionData;
  return {
    ...motionData,
    motionStakes: getUpdatedMotionStakes(
      motionStakes,
      vote,
      amount,
      requiredStake,
    ),
    usersStakes: getUpdatedUsersStakes(usersStakes, staker, vote, amount),
  };
};

export const updateMotionStakeInDB = async (
  { id, motionData }: MotionQuery,
  vote: BigNumber,
  amount: BigNumber,
  staker: string,
  requiredStake: Decimal,
) => {
  await mutate('updateColonyAction', {
    input: {
      id,
      motionData: getUpdatedMotionData(
        motionData,
        vote,
        amount,
        staker,
        requiredStake,
      ),
    },
  });
};

export const getMotionSide = (vote: BigNumber) => {
  if (vote.eq(1)) {
    return MotionSide.YAY;
  }

  return MotionSide.NAY;
};
