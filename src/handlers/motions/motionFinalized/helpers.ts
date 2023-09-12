import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { AnyVotingReputationClient, Extension } from '@colony/colony-js';

import { ColonyOperations, MotionVote } from '~types';
import {
  getCachedColonyClient,
  getColonyFromDB,
  getDomainDatabaseId,
  getExistingTokenAddresses,
  output,
  updateColonyTokens,
} from '~utils';
import { query, mutate } from '~amplifyClient';
import {
  ColonyMetadata,
  ColonyMotion,
  CreateDomainMetadataDocument,
  DomainMetadata,
  GetColonyActionByMotionIdDocument,
  GetColonyActionByMotionIdQuery,
  GetColonyActionByMotionIdQueryVariables,
  GetColonyMetadataDocument,
  GetColonyMetadataQuery,
  GetColonyMetadataQueryVariables,
  GetDomainMetadataDocument,
  GetDomainMetadataQuery,
  GetDomainMetadataQueryVariables,
  StakerReward,
  UpdateColonyDocument,
  UpdateColonyMetadataDocument,
  UpdateDomainMetadataDocument,
} from '~graphql';
import { parseAction } from '../motionCreated/helpers';

export const getStakerReward = async (
  motionId: string,
  userAddress: string,
  votingReputationClient: AnyVotingReputationClient,
): Promise<StakerReward> => {
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

const linkPendingDomainMetadataWithDomain = async (
  pendingDomainMetadata: DomainMetadata,
  colonyAddress: string,
  isEditingADomain: boolean,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!isEditingADomain) {
    const colonyClient = await getCachedColonyClient(colonyAddress);

    if (!colonyClient) {
      return;
    }

    const domainCount = await colonyClient.getDomainCount();
    // The new domain should be created by now, so we just get the total of existing domains
    // and use that as an id to link the pending metadata.
    const nativeDomainId = domainCount.toNumber();

    await mutate(CreateDomainMetadataDocument, {
      input: {
        ...pendingDomainMetadata,
        id: getDomainDatabaseId(colonyAddress, nativeDomainId),
      },
    });
  } else if (isEditingADomain) {
    const nativeDomainId = parsedAction.args[2].toNumber(); // domainId arg from editDomain action
    const databaseDomainId = getDomainDatabaseId(colonyAddress, nativeDomainId);

    const { data } =
      (await query<GetDomainMetadataQuery, GetDomainMetadataQueryVariables>(
        GetDomainMetadataDocument,
        {
          id: databaseDomainId,
        },
      )) ?? {};

    const currentDomainMetadata = data?.getDomainMetadata;

    if (!currentDomainMetadata) {
      output(
        `Unable to find current domain metadata for colony: ${colonyAddress} with nativeDomainId ${nativeDomainId}`,
      );
      return;
    }

    const updatedMetadata = {
      ...currentDomainMetadata,
    };

    const pendingChangelog = pendingDomainMetadata?.changelog ?? [];

    if (!pendingChangelog.length) {
      output(
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

    await mutate(UpdateDomainMetadataDocument, {
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
  const { data } =
    (await query<GetColonyMetadataQuery, GetColonyMetadataQueryVariables>(
      GetColonyMetadataDocument,
      {
        id: colonyAddress,
      },
    )) ?? {};

  const currentColonyMetadata = data?.getColonyMetadata;

  if (!currentColonyMetadata) {
    output(
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
    hasDescriptionChanged,
    haveExternalLinksChanged,
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

  if (hasDescriptionChanged) {
    updatedMetadata.description = pendingColonyMetadata.description;
  }

  if (haveExternalLinksChanged) {
    updatedMetadata.externalLinks = pendingColonyMetadata.externalLinks;
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

  await mutate(UpdateColonyMetadataDocument, {
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
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const oneTxPaymentClient = await colonyClient?.getExtensionClient(
    Extension.OneTxPayment,
  );

  if (!colonyClient || !oneTxPaymentClient) {
    return;
  }

  const parsedAction = parseAction(action, [colonyClient, oneTxPaymentClient]);

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
    const { data } =
      (await query<
        GetColonyActionByMotionIdQuery,
        GetColonyActionByMotionIdQueryVariables
      >(GetColonyActionByMotionIdDocument, {
        motionId: finalizedMotion.id,
      })) ?? {};

    const colonyAction = data?.getColonyActionByMotionId?.items;
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
    /*
     * @NOTE: We only want to store unclaimed stakes that have a non-zero yay or nay reward.
     * Otherwise, they will show up as unclaimed stakes in the stakes tab, but will not be claimable.
     */
    const unclaimedRewards = updatedStakerRewards.filter(
      ({ rewards }) => rewards.yay !== '0' || rewards.nay !== '0',
    );
    const unclaimedMotionStake = {
      motionId: motionDatabaseId,
      unclaimedRewards,
    };

    let { motionsWithUnclaimedStakes } = colony;

    if (motionsWithUnclaimedStakes) {
      motionsWithUnclaimedStakes.push(unclaimedMotionStake);
    } else {
      motionsWithUnclaimedStakes = [unclaimedMotionStake];
    }

    await mutate(UpdateColonyDocument, {
      input: {
        id: colonyAddress,
        motionsWithUnclaimedStakes,
      },
    });
  }
};
