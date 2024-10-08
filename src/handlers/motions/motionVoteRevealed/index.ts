import { EventHandler, MotionSide } from '~types';
import { getVotingClient, verbose } from '~utils';
import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';
import { VoterRecord } from '~graphql';
import { ExtensionEventListener } from '~eventListeners';
import { createUserReward } from './helpers';
import networkClient from '~networkClient';
import { BigNumber } from 'ethers';

export const handleMotionVoteRevealed: EventHandler = async (
  event,
  listener,
) => {
  const {
    args: { motionId, voter, vote },
    blockNumber,
  } = event;
  const { colonyAddress } = listener as ExtensionEventListener;

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const {
    votes: [nayVotes, yayVotes],
  } = await votingClient.getMotion(motionId, { blockTag: blockNumber });
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const revealedMotion = await getMotionFromDB(motionDatabaseId);

  if (revealedMotion) {
    const { voterRecord } = revealedMotion;
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

    const totalVotes = nayVotes.add(yayVotes);
    const yayVotePercentage = yayVotes.mul(100).div(totalVotes);
    const nayVotePercentage = nayVotes.mul(100).div(totalVotes);
    await updateMotionInDB({
      ...revealedMotion,
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
    });

    const rootHash = await networkClient.getReputationRootHash({
      blockTag: blockNumber,
    });
    await createUserReward({
      colonyAddress,
      motionDatabaseId,
      motionId: BigNumber.from(motionId).toString(),
      userAddress: voter,
      rootHash,
      nativeMotionDomainId: revealedMotion.nativeMotionDomainId,
    });

    verbose(
      `User: ${voter} revealed a vote of ${vote.toString()} on motion ${motionId.toString()}`,
    );
  }
};
