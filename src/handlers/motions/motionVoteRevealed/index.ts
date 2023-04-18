import { ContractEvent, VoterRecord } from '~types';
import { getVotingClient, verbose } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    args: { motionId, voter, vote },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
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
      motionData: { voterRecord },
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

    await updateMotionInDB(id, {
      ...motionData,
      voterRecord: updatedVoterRecord,
    });

    verbose(
      `User: ${voter} revealed a vote of ${vote.toString()} on motion ${motionId.toString()}`,
    );
  }
};
