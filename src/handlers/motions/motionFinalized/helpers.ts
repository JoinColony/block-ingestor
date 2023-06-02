import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import {
  ColonyMetadata,
  ColonyOperations,
  DomainMetadata,
  MotionVote,
  StakerReward,
  ColonyMotion,
  MotionQuery,
} from '~types';
import {
  getColonyFromDB,
  getDomainDatabaseId,
  getExistingTokenAddresses,
  getVotingClient,
  updateColonyTokens,
  verbose,
} from '~utils';
import networkClient from '~networkClient';
import { query, mutate } from '~amplifyClient';

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

const getParsedActionFromMotion = async (
  action: string,
  colonyAddress: string,
): Promise<TransactionDescription | undefined> => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  // We are only parsing this action in order to know if it's a add/edit domain motion. Therefore, we shouldn't need to try with any other client.
  try {
    return colonyClient.interface.parseTransaction({
      data: action,
    });
  } catch {
    verbose(`Unable to parse ${action} using colony client`);
    return undefined;
  }
};

const linkPendingDomainMetadataWithDomain = async (
  pendingDomainMetadata: DomainMetadata,
  colonyAddress: string,
  isEditingADomain: boolean,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!isEditingADomain) {
    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    const domainCount = await colonyClient.getDomainCount();
    // The new domain should be created by now, so we just get the total of existing domains
    // and use that as an id to link the pending metadata.
    const nativeDomainId = domainCount.toNumber();

    await mutate('createDomainMetadata', {
      input: {
        ...pendingDomainMetadata,
        id: getDomainDatabaseId(colonyAddress, nativeDomainId),
      },
    });
  } else if (isEditingADomain) {
    const nativeDomainId = parsedAction.args[2].toNumber(); // domainId arg from editDomain action
    const databaseDomainId = getDomainDatabaseId(colonyAddress, nativeDomainId);

    const currentDomainMetadata = await query<DomainMetadata>(
      'getDomainMetadata',
      {
        id: databaseDomainId,
      },
    );

    const updatedMetadata = {
      ...currentDomainMetadata,
    };

    const pendingChangelog = pendingDomainMetadata?.changelog ?? [];

    if (!pendingChangelog.length) {
      console.error(
        `Pending changelog for domain with database id: ${databaseDomainId} could not be found.
        This is a bug and should be investigated.`,
      );
    }

    const {
      newColor,
      newDescription,
      newName,
      oldColor,
      oldDescription,
      oldName,
    } = pendingChangelog[pendingChangelog.length - 1] ?? {};

    const hasColorChanged = newColor !== oldColor;
    const hasDescriptionChanged = newDescription !== oldDescription;
    const hasNameChanged = newName !== oldName;

    if (hasColorChanged) {
      updatedMetadata.color = newColor;
    }

    if (hasDescriptionChanged) {
      updatedMetadata.description = newDescription;
    }

    if (hasNameChanged) {
      updatedMetadata.name = newName;
    }

    await mutate('updateDomainMetadata', {
      input: {
        ...updatedMetadata,
        id: databaseDomainId,
      },
    });
  }
};

const linkPendingColonyMetadataWithColony = async (
  pendingColonyMetadata: ColonyMetadata,
  colonyAddress: string,
): Promise<void> => {
  const currentColonyMetadata = await query<ColonyMetadata>(
    'getColonyMetadata',
    {
      id: colonyAddress,
    },
  );

  if (!currentColonyMetadata) {
    console.error(
      `Could not find the current metadata for the colony: ${colonyAddress}. This is a bug and should be investigated.`,
    );
    return;
  }

  const {
    haveTokensChanged,
    hasAvatarChanged,
    hasWhitelistChanged,
    newDisplayName,
    oldDisplayName,
  } = pendingColonyMetadata.changelog?.[0] ?? {};

  const updatedMetadata = {
    ...currentColonyMetadata,
  };

  /*
   * Here, we update metadata as granularly as possible so that we don't overwrite state changes that occured
   * after this motion was created.
   */

  if (hasAvatarChanged) {
    // If avatar has changed, update avatar and thumbnail
    updatedMetadata.avatar = pendingColonyMetadata.avatar;
    updatedMetadata.thumbnail = pendingColonyMetadata.thumbnail;
  }

  if (hasWhitelistChanged) {
    // If whitelist has changed, update whitelistedAddresses and isWhitelistActivated
    updatedMetadata.isWhitelistActivated =
      pendingColonyMetadata.isWhitelistActivated;

    updatedMetadata.whitelistedAddresses =
      pendingColonyMetadata.whitelistedAddresses;
  }

  if (newDisplayName !== oldDisplayName) {
    // If displayName has changed, update displayName
    updatedMetadata.displayName = pendingColonyMetadata.displayName;
  }

  if (haveTokensChanged && pendingColonyMetadata.modifiedTokenAddresses) {
    // If tokens have changed, update colony tokens
    const colony = await getColonyFromDB(colonyAddress);

    if (colony) {
      const existingTokenAddresses = getExistingTokenAddresses(colony);

      await updateColonyTokens(
        colony,
        existingTokenAddresses,
        pendingColonyMetadata.modifiedTokenAddresses,
      );
    }
  }

  await mutate('updateColonyMetadata', {
    input: {
      ...updatedMetadata,
      changelog: [
        ...(currentColonyMetadata.changelog ?? []),
        pendingColonyMetadata.changelog?.[0],
      ],
    },
  });
};

export const linkPendingMetadata = async (
  action: string,
  colonyAddress: string,
  finalizedMotion: ColonyMotion,
): Promise<void> => {
  const parsedAction = await getParsedActionFromMotion(action, colonyAddress);

  const isMotionAddingADomain =
    parsedAction?.name === ColonyOperations.AddDomain;
  const isMotionEditingADomain =
    parsedAction?.name === ColonyOperations.EditDomain;
  const isMotionEditingAColony =
    parsedAction?.name === ColonyOperations.EditColony;

  if (
    isMotionAddingADomain ||
    isMotionEditingADomain ||
    isMotionEditingAColony
  ) {
    const { items: colonyAction } =
      (await query<{ items: MotionQuery[] }>('getColonyActionByMotionId', {
        motionId: finalizedMotion.id,
      })) ?? {};
    /*
     * pendingDomainMetadata is a motion data prop that we use to store the metadata of a Domain that COULD be created/edited
     * if the YAY side of the motion won and the motion was finalized. In this step, if the motion has passed and has a pendingDomainMetadata prop,
     * then we can assume that the motion's action is a domain action and we need to link this provisional DomainMetadata to the REAL Domain by creating
     * a new DomainMetadata with the corresponding Domain item id.
     */
    if (
      (isMotionAddingADomain || isMotionEditingADomain) &&
      colonyAction?.[0]?.pendingDomainMetadata
    ) {
      await linkPendingDomainMetadataWithDomain(
        colonyAction[0].pendingDomainMetadata,
        colonyAddress,
        isMotionEditingADomain,
        parsedAction,
      );
    } else if (
      isMotionEditingAColony &&
      colonyAction?.[0]?.pendingColonyMetadata
    ) {
      await linkPendingColonyMetadataWithColony(
        colonyAction[0].pendingColonyMetadata,
        colonyAddress,
      );
    }
  }
};

export const updateColonyUnclaimedStakes = async (
  colonyAddress: string,
  motionDatabaseId: string,
  updatedStakerRewards: StakerReward[],
): Promise<void> => {
  const colony = await getColonyFromDB(colonyAddress);
  if (colony) {
    const unclaimedMotionStake = {
      motionId: motionDatabaseId,
      unclaimedRewards: updatedStakerRewards,
    };

    let { motionsWithUnclaimedStakes } = colony;

    if (motionsWithUnclaimedStakes) {
      motionsWithUnclaimedStakes.push(unclaimedMotionStake);
    } else {
      motionsWithUnclaimedStakes = [unclaimedMotionStake];
    }

    await mutate('updateColony', {
      input: {
        id: colonyAddress,
        motionsWithUnclaimedStakes,
      },
    });
  }
};
