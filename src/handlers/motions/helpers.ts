import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import { mutate } from '~amplifyClient';
import {
  MotionData,
  MotionQuery,
  MotionSide,
  MotionStakes,
  UserStake,
} from '~types';
import { convertStakeToPercentage } from '~utils';

const getUpdatedUserStakesAmount = (
  existingAmount: string,
  amount: BigNumber,
): string => BigNumber.from(existingAmount).add(amount).toString();

const getUpdatedUserStake = (
  userStake: UserStake,
  side: MotionSide,
  amount: BigNumber,
): UserStake => {
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
    /* If the entry has the same address as the staker, we update the entry  */
    if (address === staker) {
      return getUpdatedUserStake(userStake, getMotionSide(vote), amount);
    }

    /* Else, we just return as is */
    return userStake;
  };

/** Takes the existing usersStakers db entry, and adds the latest information from the MotionStaked event. */
const getUpdatedUsersStakes = (
  usersStakes: UserStake[],
  staker: string,
  vote: BigNumber,
  amount: BigNumber,
): UserStake[] => {
  const isExistingStaker = usersStakes.some(
    ({ address }) => address === staker,
  );

  /* Has user already staked on this motion? */
  if (isExistingStaker) {
    /* If so, update their entry in the usersStakes array. */
    const updateUserStakes = getUserStakesMapFn(staker, vote, amount);
    return usersStakes.map(updateUserStakes);
  }

  /* If not, add their stake data to the end of the array. */
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

  return [...usersStakes, newUserStake] as UserStake[];
};

/** Takes existing motionStakes db entry and updates it with latest information from MotionStaked event */
const getUpdatedMotionStakes = (
  motionStakes: MotionStakes,
  vote: BigNumber,
  amount: BigNumber,
  requiredStake: Decimal,
): MotionStakes => {
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
  motionData: MotionData,
  vote: BigNumber,
  amount: BigNumber,
  staker: string,
  requiredStake: Decimal,
): MotionData => {
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
): Promise<void> => {
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

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(1) ? MotionSide.YAY : MotionSide.NAY;
