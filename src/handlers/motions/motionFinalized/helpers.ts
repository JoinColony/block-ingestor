import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { ColonyOperations, MotionQuery, MotionVote, StakerReward } from '~types';
import { getDomainDatabaseId, getVotingClient, verbose } from '~utils';
import networkClient from '~networkClient';
import { mutate } from '~amplifyClient';

export const getStakerReward = async (
  motionId: string,
  userAddress: string,
  colonyAddress: string,
): Promise<StakerReward> => {
  const votingReputationClient = await getVotingClient(colonyAddress);

  /*
   * If **anyone** staked on a side, calling the rewards function returns 0 if there's no reward (even for
   * a user who didnd't stake).
   *
   * But calling the rewards function on a side where **no one** has voted
   * will result in an error being thrown.
   *
   * Hence the try/catch.
   */
  let stakingRewardYay = BigNumber.from(0);
  let stakingRewardNay = BigNumber.from(0);
  try {
    [stakingRewardYay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      MotionVote.YAY,
    );
  } catch (error) {
    // We don't care to catch the error since we fallback to it's initial value
  }
  try {
    [stakingRewardNay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      MotionVote.NAY,
    );
  } catch (error) {
    // silent error
  }

  return {
    address: userAddress,
    rewards: {
      nay: stakingRewardNay.toString(),
      yay: stakingRewardYay.toString(),
    },
    isClaimed: false,
  };
};

export const getParsedActionFromMotion = async (
  motionAction: string,
  colonyAddress: string,
): Promise<TransactionDescription | undefined> => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  // We are only parsing this action in order to know if it's a add/edit domain motion. Therefore, we shouldn't need to try with any other client.
  try {
    return colonyClient.interface.parseTransaction({
      data: motionAction,
    });    
  } catch {
    verbose(`Unable to parse ${motionAction} using colony client`);
    return undefined;
  }
};

export const linkPendingDomainMetadataWithDomain = async (action: string, colonyAddress: string, finalizedMotion: MotionQuery) => {
  const parsedDomainAction = await getParsedActionFromMotion(action, colonyAddress);
  if (parsedDomainAction?.name === ColonyOperations.AddDomain) {
    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    const domainCount = await colonyClient.getDomainCount();
    // The new domain should be created by now, so we just get the total of existing domains
    // and use that as an id to link the pending metadata.
    const nativeDomainId = domainCount.toNumber();

    await mutate('createDomainMetadata', {
      input: {
        ...finalizedMotion.pendingDomainMetadata,
        id: getDomainDatabaseId(colonyAddress, nativeDomainId),
        
      },
    });        
  } else if (parsedDomainAction?.name === ColonyOperations.EditDomain) {
    const nativeDomainId = parsedDomainAction.args[2].toNumber(); // domainId arg from editDomain action

    await mutate('updateDomainMetadata', {
      input: {
        ...finalizedMotion.pendingDomainMetadata,
        id: getDomainDatabaseId(colonyAddress, nativeDomainId),
      },
    }); 
  }
};