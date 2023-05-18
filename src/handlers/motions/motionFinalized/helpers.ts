import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import {
  ColonyMetadata,
  ColonyOperations,
  DomainMetadata,
  MotionVote,
  StakerReward,
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

const getParsedActionFromDomainMotion = async (
  domainAction: string,
  colonyAddress: string,
): Promise<TransactionDescription | undefined> => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  // We are only parsing this action in order to know if it's a add/edit domain motion. Therefore, we shouldn't need to try with any other client.
  try {
    return colonyClient.interface.parseTransaction({
      data: domainAction,
    });
  } catch {
    verbose(`Unable to parse ${domainAction} using colony client`);
    return undefined;
  }
};

export const linkPendingDomainMetadataWithDomain = async (
  action: string,
  colonyAddress: string,
  pendingDomainMetadata: DomainMetadata,
): Promise<void> => {
  const parsedDomainAction = await getParsedActionFromDomainMotion(
    action,
    colonyAddress,
  );
  if (parsedDomainAction?.name === ColonyOperations.AddDomain) {
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
  } else if (parsedDomainAction?.name === ColonyOperations.EditDomain) {
    const nativeDomainId = parsedDomainAction.args[2].toNumber(); // domainId arg from editDomain action
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

    const { changelog: pendingChangelog = [] } = pendingDomainMetadata;

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

export const linkPendingColonyMetadataWithColony = async (
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
