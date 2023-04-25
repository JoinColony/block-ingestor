import { ColonyOperations, ContractEvent } from '~types';
import { getDomainDatabaseId, getVotingClient } from '~utils';
import { mutate } from '~amplifyClient';
import networkClient from '~networkClient';

import {
  getMotionDatabaseId,
  getMotionFromDB,
  updateMotionInDB,
} from '../helpers';

import { getParsedActionFromMotion, getStakerReward } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
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
      motionData: { usersStakes },
      motionData,
    } = finalizedMotion;

    if (finalizedMotion.pendingDomainMetadata) {
      const parsedDomainAction = await getParsedActionFromMotion(action, colonyAddress);
      if (parsedDomainAction?.name === ColonyOperations.AddDomain) {
        const colonyClient = await networkClient.getColonyClient(colonyAddress);
        const domainCount = await colonyClient.getDomainCount();
        const nativeDomainId = domainCount.add(1).toNumber();

        await mutate('createDomainMetadata', {
          input: {
            ...finalizedMotion.pendingDomainMetadata,
            id: getDomainDatabaseId(colonyAddress, nativeDomainId),
            
          },
        });        
      } else if (parsedDomainAction?.name === ColonyOperations.EditDomain) {
        const nativeDomainId = parsedDomainAction.args[2].toNumber();

        await mutate('updateDomainMetadata', {
          input: {
            ...finalizedMotion.pendingDomainMetadata,
            id: getDomainDatabaseId(colonyAddress, nativeDomainId),
          },
        }); 
      }
    }

    const updatedStakerRewards = await Promise.all(
      usersStakes.map(
        async ({ address: userAddress }) =>
          await getStakerReward(motionId, userAddress, colonyAddress),
      ),
    );

    const updatedMotionData = {
      ...motionData,
      stakerRewards: updatedStakerRewards,
      isFinalized: true,
    };

    await updateMotionInDB(finalizedMotion.id, updatedMotionData);
  }
};
