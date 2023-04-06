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
    contractAddress: colonyAddress,
    args: { motionId, voter },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const votedMotion = await getMotionFromDB(colonyAddress, motionDatabaseId);

  if (votedMotion) {
    const {
      id,
      motionData: { voterRecord },
      motionData,
    } = votedMotion;

    const updatedVoterRecord = getUpdatedVoterRecord(voterRecord, voter);
    await updateMotionInDB(id, {
      ...motionData,
      voterRecord: updatedVoterRecord,
    });

    verbose(`User: ${voter} voted on motion ${motionId.toString()}`);
  }
};
