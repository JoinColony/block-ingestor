import { ContractEvent } from '~types';
import { BigNumber } from 'ethers';
import { verbose, getVotingClient } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
  getUpdatedUsersStakes,
  updateMotionInDB,
} from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    logIndex,
    transactionHash,
    args: { vote, amount, staker, motionId },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const { skillRep, stakes } = await votingClient.getMotion(motionId);

  const requiredStake = getRequiredStake(skillRep, totalStakeFraction);
  const motionStakes = getMotionStakes(requiredStake, stakes);
  const remainingStakes = getRemainingStakes(requiredStake, stakes);
  const showInActionsList =
    Number(motionStakes.percentage.yay) + Number(motionStakes.percentage.nay) >=
    10;
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const stakedMotion = await getMotionFromDB(colonyAddress, motionDatabaseId);

  if (stakedMotion) {
    const {
      id,
      motionData: { usersStakes, events: updatedEvents },
      motionData,
    } = stakedMotion;

    if (vote.eq(0) && !updatedEvents.find(({ name }) => name === 'ObjectionRaised')) {
      updatedEvents.push(
        {
          name: 'ObjectionRaised',
          transactionHash,
          logIndex,
          initiatorAddress: staker,
        },
      );
    }

    updatedEvents.push(
      {
        name: 'MotionStaked',
        transactionHash,
        logIndex,
        initiatorAddress: staker,
        vote: vote.toString(),
        amount: amount.toString(),
      },
    );

    if (requiredStake.eq(BigNumber.from(motionStakes.raw.yay))) {
      const eventName = !updatedEvents.find(({ name }) => name === 'ObjectionRaised') ? 'MotionFullyStaked' : 'MotionFullyStakedAfterObjection';
      updatedEvents.push(
        {
          name: eventName,
          transactionHash,
          logIndex,
          initiatorAddress: staker,
        },
      );
    }
    if (requiredStake.eq(BigNumber.from(motionStakes.raw.nay))) {
      updatedEvents.push(
        {
          name: 'ObjectionFullyStaked',
          transactionHash,
          logIndex,
          initiatorAddress: staker,
        },
      );
    }

    const updatedUserStakes = getUpdatedUsersStakes(
      usersStakes,
      staker,
      vote,
      amount,
      requiredStake,
    );

    await updateMotionInDB(
      id,
      {
        ...motionData,
        usersStakes: updatedUserStakes,
        motionStakes,
        remainingStakes,
        events: updatedEvents,
      },
      showInActionsList,
    );

    verbose(
      `User: ${staker} staked motion ${motionId.toString()} by ${amount.toString()} on side ${getMotionSide(
        vote,
      )}`,
    );
  }
};
