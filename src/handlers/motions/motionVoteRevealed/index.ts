import { ContractEvent, VoterRecord, MotionSide } from '~types';
import { getVotingClient, verbose } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';
import { getUpdatedMessages } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    logIndex,
    transactionHash,
    args: { motionId, voter, vote },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const {
    votes: [nayVotes, yayVotes],
  } = await votingClient.getMotion(motionId);
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const revealedMotion = await getMotionFromDB(colonyAddress, motionDatabaseId);

  if (revealedMotion) {
    const {
      id,
      motionData: { voterRecord, messages },
      motionData,
    } = revealedMotion;
    const updatedVoterRecord = voterRecord.map((record) => {
      const { address } = record;
      if (address !== voter) {
        return record;
      }

      const updatedRecord: VoterRecord = {
        ...record,
        vote: vote.toNumber(),
      };

      return updatedRecord;
    });

    const updatedMessages = getUpdatedMessages({
      messages,
      messageKey: `${transactionHash}${logIndex}`,
      voter,
      votes: [nayVotes, yayVotes],
    });

    const totalVotes = nayVotes.add(yayVotes);
    const yayVotePercentage = yayVotes.mul(100).div(totalVotes);
    const nayVotePercentage = nayVotes.mul(100).div(totalVotes);
    await updateMotionInDB(id, {
      ...motionData,
      voterRecord: updatedVoterRecord,
      revealedVotes: {
        raw: {
          [MotionSide.NAY]: nayVotes.toString(),
          [MotionSide.YAY]: yayVotes.toString(),
        },
        percentage: {
          [MotionSide.NAY]: nayVotePercentage.toString(),
          [MotionSide.YAY]: yayVotePercentage.toString(),
        },
      },
      messages: updatedMessages,
    });

    verbose(
      `User: ${voter} revealed a vote of ${vote.toString()} on motion ${motionId.toString()}`,
    );
  }
};
