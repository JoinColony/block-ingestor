import { ContractEvent } from '~types';
import { verbose, getVotingClient } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  getMotionSide,
  getMotionStakes,
  getRemainingStakes,
  getRequiredStake,
  getUpdatedUsersStakes,
  getUpdatedMessages,
  updateMotionInDB,
  getMessageKey,
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
  const motionStakes = getMotionStakes(requiredStake, stakes, vote);
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
  const stakedMotion = await getMotionFromDB(motionDatabaseId);

  if (stakedMotion) {
    const {
      usersStakes,
      messages,
    } = stakedMotion;

    const updatedUserStakes = getUpdatedUsersStakes(
      usersStakes,
      staker,
      vote,
      amount,
      requiredStake,
    );
    const updatedMessages = getUpdatedMessages({
      motionData: stakedMotion,
      messages,
      requiredStake,
      motionStakes,
      messageKey: getMessageKey(transactionHash, logIndex),
      vote,
      staker,
      amount,
    });

    await updateMotionInDB(
      {
        ...stakedMotion,
        usersStakes: updatedUserStakes,
        motionStakes,
        remainingStakes,
        messages: updatedMessages,
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
