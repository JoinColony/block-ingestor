import { BigNumber, constants } from 'ethers';
import {
  MotionStakes,
  UserStakes,
  MotionMessage,
  MotionData,
  MotionVote,
  MotionEvents,
} from '~types';
import { getMotionSide } from '../helpers';

export const getRequiredStake = (
  skillRep: BigNumber,
  totalStakeFraction: BigNumber,
): BigNumber =>
  skillRep.mul(totalStakeFraction).div(BigNumber.from(10).pow(18));

export const getMotionStakes = (
  requiredStake: BigNumber,
  [totalNayStakesRaw, totalYayStakesRaw]: [BigNumber, BigNumber],
): MotionStakes => {
  const totalYayStakesPercentage = getStakePercentage(
    totalYayStakesRaw,
    requiredStake,
  );

  const totalNayStakesPercentage = getStakePercentage(
    totalNayStakesRaw,
    requiredStake,
  );

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

export const getRemainingStakes = (
  requiredStake: BigNumber,
  [totalNayStakesRaw, totalYayStakesRaw]: [BigNumber, BigNumber],
): [string, string] => {
  const remainingYayStake = requiredStake.sub(totalYayStakesRaw).toString();
  const remainingNayStake = requiredStake.sub(totalNayStakesRaw).toString();
  return [remainingNayStake, remainingYayStake];
};

export const getStakePercentage = (
  stake: BigNumber,
  requiredStake: BigNumber,
): BigNumber => {
  const percentage = stake.mul(100).div(requiredStake);

  // May be zero due to rounding. Since a user cannot stake 0%, we round up to 1.
  if (percentage.isZero()) {
    return percentage.add(1);
  }

  return percentage;
};

/**
 * Given staking data, format and return new UserStakes object
 */
const getNewUserStakes = (
  staker: string,
  vote: BigNumber,
  amount: BigNumber,
  requiredStake: BigNumber,
): UserStakes => {
  const invertedVote = BigNumber.from(1).sub(vote);
  const stakedSide = getMotionSide(vote);
  const unstakedSide = getMotionSide(invertedVote);
  return {
    address: staker,
    stakes: {
      raw: {
        [stakedSide]: amount.toString(),
        [unstakedSide]: '0',
      },

      percentage: {
        [stakedSide]: getStakePercentage(amount, requiredStake).toString(),
        [unstakedSide]: '0',
      },
    }, // TS doesn't like the computed keys, but we know they're correct
  } as unknown as UserStakes;
};

/**
 * Given staking data, add stakes to existing stakes and return new, updated UserStakes object
 */
const getUpdatedUserStakes = (
  existingUserStakes: UserStakes,
  amount: BigNumber,
  vote: BigNumber,
  requiredStake: BigNumber,
): UserStakes => {
  const stakedSide = getMotionSide(vote);
  const existingRawStake = existingUserStakes.stakes.raw[stakedSide];
  const updatedRawStake = amount.add(existingRawStake);
  const updatedPercentage = getStakePercentage(updatedRawStake, requiredStake);
  const updatedUserStakes: UserStakes = {
    ...existingUserStakes,
    stakes: {
      raw: {
        ...existingUserStakes.stakes.raw,
        [stakedSide]: updatedRawStake.toString(),
      },
      percentage: {
        ...existingUserStakes.stakes.percentage,
        [stakedSide]: updatedPercentage.toString(),
      },
    },
  };

  return updatedUserStakes;
};

type UserStakesMapFn = (usersStakes: UserStakes) => UserStakes;

const getUserStakesMapFn =
  (
    staker: string,
    vote: BigNumber,
    amount: BigNumber,
    requiredStake: BigNumber,
  ): UserStakesMapFn =>
  (userStakes: UserStakes): UserStakes => {
    const { address } = userStakes;

    if (address === staker) {
      return getUpdatedUserStakes(userStakes, amount, vote, requiredStake);
    }

    return userStakes;
  };

/**
 * Takes existing usersStakes and updates the entry with the latest stake data
 */
export const getUpdatedUsersStakes = (
  usersStakes: UserStakes[],
  staker: string,
  vote: BigNumber,
  amount: BigNumber,
  requiredStake: BigNumber,
): UserStakes[] => {
  const isExistingStaker = usersStakes.some(
    ({ address }) => address === staker,
  );

  if (isExistingStaker) {
    const updateUserStakes = getUserStakesMapFn(
      staker,
      vote,
      amount,
      requiredStake,
    );

    return usersStakes.map(updateUserStakes);
  }

  const newUserStakes = getNewUserStakes(staker, vote, amount, requiredStake);

  return [...usersStakes, newUserStakes];
};

export const getUserMinStake = (
  totalStakeFraction: BigNumber,
  userMinStakeFraction: BigNumber,
  skillRep: BigNumber,
): string => {
  /*
   * Both totalStakeFraction and userMinStakeFraction both divide by 10 to the power of 18.
   * Since we've multiplied by both, we need to divide by 10 to the power of 18, twice.
   */

  return skillRep
    .mul(totalStakeFraction)
    .mul(userMinStakeFraction)
    .div(BigNumber.from(10).pow(36))
    .toString();
};

interface Props {
  motionData: MotionData;
  messages: MotionMessage[];
  requiredStake: BigNumber;
  motionStakes: MotionStakes;
  messageKey: string;
  vote: BigNumber;
  staker: string;
  amount: BigNumber;
}

export const getUpdatedMessages = ({
  motionData,
  messages,
  requiredStake,
  motionStakes,
  messageKey,
  vote,
  staker,
  amount,
}: Props): MotionMessage[] => {
  const updatedMessages = [...messages];
  const isFirstObjection = vote.eq(MotionVote.NAY) && !motionData.hasObjection;
  const isFullyYayStaked =
    vote.eq(MotionVote.YAY) && requiredStake.eq(motionStakes.raw.yay);
  const isFullyNayStaked =
    vote.eq(MotionVote.NAY) && requiredStake.eq(motionStakes.raw.nay);
  const bothSidesFullyStaked =
    requiredStake.eq(motionStakes.raw.yay) &&
    requiredStake.eq(motionStakes.raw.nay);

  if (isFirstObjection) {
    motionData.hasObjection = true;
    updatedMessages.push({
      name: MotionEvents.ObjectionRaised,
      messageKey: `${messageKey}_${MotionEvents.ObjectionRaised}}`,
      initiatorAddress: staker,
    });
  }

  updatedMessages.push({
    name: MotionEvents.MotionStaked,
    messageKey,
    initiatorAddress: staker,
    vote: vote.toString(),
    amount: amount.toString(),
  });

  if (isFullyYayStaked) {
    const messageName = motionData.hasObjection
      ? MotionEvents.MotionFullyStakedAfterObjection
      : MotionEvents.MotionFullyStaked;
    updatedMessages.push({
      name: messageName,
      messageKey: `${messageKey}_${messageName}`,
      initiatorAddress: staker,
    });
  }

  // Only send an ObjectionFullyStaked message if the motion has not already been fully staked for the YAY side
  if (
    isFullyNayStaked &&
    BigNumber.from(motionStakes.raw.nay).gt(motionStakes.raw.yay)
  ) {
    updatedMessages.push({
      name: MotionEvents.ObjectionFullyStaked,
      messageKey: `${messageKey}_${MotionEvents.ObjectionFullyStaked}`,
      initiatorAddress: staker,
    });
  }

  if (bothSidesFullyStaked) {
    updatedMessages.push({
      name: MotionEvents.MotionVotingPhase,
      messageKey: `${messageKey}_${MotionEvents.MotionVotingPhase}`,
      initiatorAddress: constants.AddressZero,
    });
  }

  return updatedMessages;
};
