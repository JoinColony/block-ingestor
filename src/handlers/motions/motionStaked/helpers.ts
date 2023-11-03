import { BigNumber, constants } from 'ethers';
import { MotionVote, MotionEvents } from '~types';
import {
  ColonyMotion,
  CreateColonyStakeDocument,
  CreateColonyStakeMutation,
  CreateColonyStakeMutationVariables,
  CreateMotionMessageInput,
  GetColonyStakeDocument,
  GetColonyStakeQuery,
  GetColonyStakeQueryVariables,
  MotionStakes,
  UpdateColonyStakeDocument,
  UpdateColonyStakeMutation,
  UpdateColonyStakeMutationVariables,
  UserMotionStakes,
} from '~graphql';
import { mutate, query } from '~amplifyClient';
import { getMotionSide, getColonyStakeId } from '../helpers';

export const getRequiredStake = (
  skillRep: BigNumber,
  totalStakeFraction: BigNumber,
): BigNumber =>
  skillRep.mul(totalStakeFraction).div(BigNumber.from(10).pow(18));

export const getMotionStakes = (
  requiredStake: BigNumber,
  [totalNayStakesRaw, totalYayStakesRaw]: [BigNumber, BigNumber],
  vote: BigNumber,
): MotionStakes => {
  const totalYayStakesPercentage = getStakePercentage(
    totalYayStakesRaw,
    requiredStake,
    vote.eq(MotionVote.YAY),
  );

  const totalNayStakesPercentage = getStakePercentage(
    totalNayStakesRaw,
    requiredStake,
    vote.eq(MotionVote.NAY),
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

const getStakePercentage = (
  stake: BigNumber,
  requiredStake: BigNumber,
  roundToOne: boolean = true,
): BigNumber => {
  const stakePercentage = stake.mul(100).div(requiredStake);
  // May be zero due to rounding. Since a user cannot stake 0%, we round up to 1.
  return roundToOne && stakePercentage.isZero()
    ? stakePercentage.add(1)
    : stakePercentage;
};

/**
 * Given staking data, format and return new UserStakes object
 */
const getNewUserStakes = (
  staker: string,
  vote: BigNumber,
  amount: BigNumber,
  requiredStake: BigNumber,
): UserMotionStakes => {
  const invertedVote = BigNumber.from(1).sub(vote);
  const stakedSide = getMotionSide(vote);
  const unstakedSide = getMotionSide(invertedVote);
  const stakePercentage = getStakePercentage(amount, requiredStake);

  return {
    address: staker,
    stakes: {
      raw: {
        [stakedSide]: amount.toString(),
        [unstakedSide]: '0',
      },

      percentage: {
        [stakedSide]: stakePercentage.toString(),
        [unstakedSide]: '0',
      },
    }, // TS doesn't like the computed keys, but we know they're correct
  } as unknown as UserMotionStakes;
};

/**
 * Given staking data, add stakes to existing stakes and return new, updated UserStakes object
 */
const getUpdatedUserStakes = (
  existingUserStakes: UserMotionStakes,
  amount: BigNumber,
  vote: BigNumber,
  requiredStake: BigNumber,
): UserMotionStakes => {
  const stakedSide = getMotionSide(vote);
  const existingRawStake = existingUserStakes.stakes.raw[stakedSide];
  const updatedRawStake = amount.add(existingRawStake);
  const updatedPercentage = getStakePercentage(updatedRawStake, requiredStake);
  const updatedUserStakes: UserMotionStakes = {
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

type UserStakesMapFn = (usersStakes: UserMotionStakes) => UserMotionStakes;

const getUserStakesMapFn =
  (
    staker: string,
    vote: BigNumber,
    amount: BigNumber,
    requiredStake: BigNumber,
  ): UserStakesMapFn =>
  (userStakes: UserMotionStakes): UserMotionStakes => {
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
  usersStakes: UserMotionStakes[],
  staker: string,
  vote: BigNumber,
  amount: BigNumber,
  requiredStake: BigNumber,
): UserMotionStakes[] => {
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
  motionData: ColonyMotion;
  requiredStake: BigNumber;
  motionStakes: MotionStakes;
  messageKey: string;
  vote: BigNumber;
  staker: string;
  amount: BigNumber;
}

export const getUpdatedMessages = ({
  motionData,
  requiredStake,
  motionStakes,
  messageKey,
  vote,
  staker,
  amount,
}: Props): CreateMotionMessageInput[] => {
  const updatedMessages = [];
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
      motionId: motionData.id,
    });
  }

  updatedMessages.push({
    name: MotionEvents.MotionStaked,
    messageKey,
    initiatorAddress: staker,
    vote: vote.toString(),
    amount: amount.toString(),
    motionId: motionData.id,
  });

  if (isFullyYayStaked) {
    const messageName = motionData.hasObjection
      ? MotionEvents.MotionFullyStakedAfterObjection
      : MotionEvents.MotionFullyStaked;
    updatedMessages.push({
      name: messageName,
      messageKey: `${messageKey}_${messageName}`,
      initiatorAddress: staker,
      motionId: motionData.id,
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
      motionId: motionData.id,
    });
  }

  if (bothSidesFullyStaked) {
    updatedMessages.push({
      name: MotionEvents.MotionVotingPhase,
      messageKey: `${messageKey}_${MotionEvents.MotionVotingPhase}`,
      initiatorAddress: constants.AddressZero,
      motionId: motionData.id,
    });
  }

  return updatedMessages;
};

/**
 * If it's the first time a user has staked in a colony, we create a Colony Stake record for the user,
 * else we update the amount they've currently got staked in the colony.
 */
export const updateUserStake = async (
  userAddress: string,
  colonyAddress: string,
  stakeAmount: BigNumber,
): Promise<void> => {
  const colonyStakeId = getColonyStakeId(userAddress, colonyAddress);
  const { data } =
    (await query<GetColonyStakeQuery, GetColonyStakeQueryVariables>(
      GetColonyStakeDocument,
      {
        colonyStakeId,
      },
    )) ?? {};

  if (data?.getColonyStake) {
    const { totalAmount } = data?.getColonyStake;
    const updatedTotal = BigNumber.from(totalAmount).add(stakeAmount);

    await mutate<UpdateColonyStakeMutation, UpdateColonyStakeMutationVariables>(
      UpdateColonyStakeDocument,
      {
        totalAmount: updatedTotal.toString(),
        colonyStakeId,
      },
    );
  } else {
    await mutate<CreateColonyStakeMutation, CreateColonyStakeMutationVariables>(
      CreateColonyStakeDocument,
      {
        totalAmount: stakeAmount.toString(),
        colonyStakeId,
        colonyAddress,
        userAddress,
      },
    );
  }
};
