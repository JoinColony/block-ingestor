import { BigNumber, constants } from 'ethers';

import { ContractEvent, MotionEvents } from '~types';
import { getVotingClient } from '~utils';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
  getMessageKey,
} from '../helpers';
import { getStakerReward, linkPendingDomainMetadataWithDomain } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    logIndex,
    transactionHash,
    args: { motionId, action },
  } = event;

  const votingClient = await getVotingClient(colonyAddress);
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );
  const finalizedMotion = await getMotionFromDB(
    colonyAddress,
    motionDatabaseId,
  );
  if (finalizedMotion) {
    const {
      motionData: {
        usersStakes,
        revealedVotes: {
          raw: { yay: yayVotes, nay: nayVotes },
        },
        motionStakes: {
          percentage: { yay: yayPercentage, nay: nayPercentage },
        },
        messages,
      },
      motionData,
    } = finalizedMotion;

    const yayWon = BigNumber.from(yayVotes).gt(nayVotes) || (Number(yayPercentage) > Number(nayPercentage));

    /*
     * pendingDomainMetadata is a motion data prop that we use to store the metadata of a Domain that COULD be created/edited
     * if the YAY side of the motion won and the motion was finalized. In this step, if the motion has passed and has a pendingDomainMetadata prop,
     * then we can assume that the motion's action is a domain action and we need to link this provisional DomainMetadata to the REAL Domain by creating
     * a new DomainMetadata with the corresponding Domain item id.
     */
    if (finalizedMotion.pendingDomainMetadata && yayWon) {
      await linkPendingDomainMetadataWithDomain(action, colonyAddress, finalizedMotion);
    }

    const updatedStakerRewards = await Promise.all(
      usersStakes.map(
        async ({ address: userAddress }) =>
          await getStakerReward(motionId, userAddress, colonyAddress),
      ),
    );

    const updatedMessages = [
      ...messages,
      {
        initiatorAddress: constants.AddressZero,
        name: MotionEvents.MotionFinalized,
        messageKey: getMessageKey(transactionHash, logIndex),
      },
    ];

    const updatedMotionData = {
      ...motionData,
      stakerRewards: updatedStakerRewards,
      isFinalized: true,
      messages: updatedMessages,
    };

    await updateMotionInDB(finalizedMotion.id, updatedMotionData);
  }
};
