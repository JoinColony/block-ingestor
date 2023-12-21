import { ContractEvent } from '~types';
import { getVotingClient, verbose } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';
import { getUpdatedVoterRecord } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    colonyAddress,
    args: { motionId, voter },
    blockNumber,
  } = event;

  if (!colonyAddress) {
    return;
  }

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const { repSubmitted } = await votingClient.getMotion(motionId, {
    blockTag: blockNumber,
  });
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const votedMotion = await getMotionFromDB(motionDatabaseId);

  if (votedMotion) {
    const { voterRecord } = votedMotion;

    const updatedVoterRecord = getUpdatedVoterRecord(voterRecord, voter);
    await updateMotionInDB({
      ...votedMotion,
      voterRecord: updatedVoterRecord,
      repSubmitted: repSubmitted.toString(),
      motionStateHistory: {
        ...votedMotion.motionStateHistory,
        hasVoted: true,
      },
    });

    verbose(`User: ${voter} voted on motion ${motionId.toString()}`);
  }
};
