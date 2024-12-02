import { Id } from '@colony/colony-js';
import { utils } from 'ethers';
import { randomUUID } from 'crypto';
import amplifyClient from '~amplifyClient';
import {
  ColonyType,
  CreateColonyDocument,
  CreateColonyMemberInviteDocument,
  CreateColonyMemberInviteMutation,
  CreateColonyMemberInviteMutationVariables,
  CreateColonyMetadataDocument,
  CreateColonyMetadataMutation,
  CreateColonyMetadataMutationVariables,
  CreateColonyMutation,
  CreateColonyMutationVariables,
  CreateColonyTokensDocument,
  CreateColonyTokensMutation,
  CreateColonyTokensMutationVariables,
  CreateDomainDocument,
  CreateDomainMetadataDocument,
  CreateDomainMetadataMutation,
  CreateDomainMetadataMutationVariables,
  CreateDomainMutation,
  CreateDomainMutationVariables,
  DeleteColonyMetadataDocument,
  DeleteColonyMetadataMutation,
  DeleteColonyMetadataMutationVariables,
  DomainColor,
  GetColonyByNameDocument,
  GetColonyByNameQuery,
  GetColonyByNameQueryVariables,
  GetColonyDocument,
  GetColonyMetadataDocument,
  GetColonyMetadataQuery,
  GetColonyMetadataQueryVariables,
  GetColonyQuery,
  GetColonyQueryVariables,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
} from '@joincolony/graphql';
import rpcProvider from '~provider';
import { getCachedColonyClient } from '~utils/clients/colony';
import { RESERVED_ROUTES } from '~constants';

export const createUniqueColony = async ({
  colonyAddress,
  tokenAddress,
  transactionHash,
  initiatorAddress,
  createdAtBlock,
}: {
  colonyAddress: string;
  tokenAddress: string;
  transactionHash: string;
  initiatorAddress: string;
  createdAtBlock: number;
}): Promise<void> => {
  /*
   * Validate Colony and Token addresses
   */
  let checksummedAddress;
  let checksummedToken;
  try {
    checksummedAddress = utils.getAddress(colonyAddress);
  } catch (error) {
    throw new Error(
      `Colony address "${colonyAddress}" is not valid (after checksum)`,
    );
  }
  try {
    checksummedToken = utils.getAddress(tokenAddress);
  } catch (error) {
    throw new Error(
      `Token address "${tokenAddress}" is not valid (after checksum)`,
    );
  }

  if (checksummedAddress === checksummedToken) {
    throw new Error(
      `Token address "${checksummedToken}" and Colony address "${checksummedAddress}" cannot be the same`,
    );
  }

  /*
   * Determine if the colony was already registered
   * Via it's address
   */
  const colonyQuery =
    (await amplifyClient.query<GetColonyQuery, GetColonyQueryVariables>(
      GetColonyDocument,
      {
        id: checksummedAddress,
      },
    )) ?? {};

  if (!colonyQuery.data) {
    throw new Error('Could not fetch colony data');
  }

  const [existingColonyAddress] =
    colonyQuery?.data?.getColonyByAddress?.items ?? [];

  if (existingColonyAddress) {
    throw new Error(
      `Colony with address "${existingColonyAddress.id}" is already registered`,
    );
  }

  /*
   * Get metadata, determine if it's the correct one, and if we should proceed
   */
  const metadataQuery =
    (await amplifyClient.query<
      GetColonyMetadataQuery,
      GetColonyMetadataQueryVariables
    >(GetColonyMetadataDocument, {
      id: `etherealcolonymetadata-${transactionHash}`,
    })) ?? {};

  if (!metadataQuery.data) {
    throw new Error('Could not fetch metadata data');
  }

  const {
    colonyName = '',
    colonyDisplayName = '',
    tokenAvatar = null,
    tokenThumbnail = null,
    initiatorAddress: metadataInitiatorAddress = '',
  } = metadataQuery?.data?.getColonyMetadata?.etherealData ?? {};

  if (
    utils.getAddress(metadataInitiatorAddress) !==
    utils.getAddress(initiatorAddress)
  ) {
    throw new Error(
      `Colony metadata does not match the colony we are trying to create`,
    );
  }

  /*
   * Ensure the colony name doesn't already exist in the database
   */
  const colonyNameQuery =
    (await amplifyClient.query<
      GetColonyByNameQuery,
      GetColonyByNameQueryVariables
    >(GetColonyByNameDocument, { name: colonyName })) ?? {};

  if (!colonyNameQuery) {
    throw new Error();
  }

  const [{ name: existingColonyName = '' } = {}] = (colonyNameQuery?.data
    ?.getColonyByName?.items ?? []) as Array<{ name: string }>;

  if (existingColonyName === colonyName) {
    throw new Error(
      `Colony with name "${colonyName}" already exists. Cannot create another one.`,
    );
  }

  if (RESERVED_ROUTES.has(colonyName)) {
    throw new Error(
      `${colonyName} is a reserved route. Cannot create a colony with this name.`,
    );
  }

  /*
   * Get colony client
   */
  const colonyClient = await getCachedColonyClient(checksummedAddress);

  if (!colonyClient) {
    throw new Error();
  }

  /*
   * Create token in the database
   */
  const tokenQuery = await amplifyClient.query<
    GetTokenFromEverywhereQuery,
    GetTokenFromEverywhereQueryVariables
  >(GetTokenFromEverywhereDocument, {
    input: {
      tokenAddress: checksummedToken,
      avatar: tokenAvatar,
      thumbnail: tokenThumbnail,
    },
  });

  if (!tokenQuery) {
    throw new Error();
  }

  const [existingToken] = tokenQuery?.data?.getTokenFromEverywhere?.items ?? [];

  if (!existingToken?.id) {
    throw new Error(
      `Token with address "${checksummedToken}" does not exist, hence it cannot be used as a native token for this colony`,
    );
  }

  const memberInviteCode = randomUUID();

  const chainId = rpcProvider.getChainId();
  const version = await colonyClient.version();

  let isTokenLocked;
  if ('locked' in colonyClient.tokenClient) {
    isTokenLocked = await colonyClient.tokenClient.locked();
  }

  const colonyMutation = await amplifyClient.mutate<
    CreateColonyMutation,
    CreateColonyMutationVariables
  >(CreateColonyDocument, {
    input: {
      id: checksummedAddress, // comes from event
      nativeTokenId: checksummedToken, // comes from event
      name: colonyName, // above
      type: ColonyType.Colony, // default
      chainMetadata: {
        chainId,
      },
      createdAtBlock,
      version: version.toNumber(),
      status: {
        nativeToken: {
          unlocked: !isTokenLocked,
          // set to false until we know the proper state
          // if it's a colony token, this will get updated when
          // log set authority will be set
          mintable: false,
          unlockable: false,
        },
      },
      colonyMemberInviteCode: memberInviteCode, // above
    },
  });

  if (!colonyMutation) {
    throw new Error(
      `Could not create colony "${colonyName}" with address "${checksummedAddress}"`,
    );
  }

  /*
   * Set the actual colony metadata object
   */
  const colonyMetadataMutation = await amplifyClient.mutate<
    CreateColonyMetadataMutation,
    CreateColonyMetadataMutationVariables
  >(CreateColonyMetadataDocument, {
    input: {
      id: checksummedAddress,
      displayName: colonyDisplayName,
    },
  });

  if (!colonyMetadataMutation) {
    throw new Error(
      `Could not create metadata entry for colony "${colonyName}" with address "${checksummedAddress}"`,
    );
  }

  /*
   * Delete the ethereal metadata entry
   */
  await amplifyClient.mutate<
    DeleteColonyMetadataMutation,
    DeleteColonyMetadataMutationVariables
  >(DeleteColonyMetadataDocument, {
    input: { id: `etherealcolonymetadata-${transactionHash}` },
  });

  /*
   * Create the member invite
   */
  const inviteMutation = await amplifyClient.mutate<
    CreateColonyMemberInviteMutation,
    CreateColonyMemberInviteMutationVariables
  >(CreateColonyMemberInviteDocument, {
    input: {
      id: memberInviteCode,
      colonyId: checksummedAddress,
      invitesRemaining: 100,
    },
  });

  if (!inviteMutation) {
    throw new Error(`Could not create private member invite`);
  }

  /*
   * Add token to the colony's token list
   */
  await amplifyClient.mutate<
    CreateColonyTokensMutation,
    CreateColonyTokensMutationVariables
  >(CreateColonyTokensDocument, {
    input: {
      colonyID: checksummedAddress,
      tokenID: checksummedToken,
    },
  });

  /*
   * Create the root domain metadata
   */
  await amplifyClient.mutate<
    CreateDomainMetadataMutation,
    CreateDomainMetadataMutationVariables
  >(CreateDomainMetadataDocument, {
    input: {
      id: `${checksummedAddress}_${Id.RootDomain}`,
      color: DomainColor.Root,
      name: 'General',
      description: '',
    },
  });

  const [skillId, fundingPotId] = await colonyClient.getDomain(Id.RootDomain);

  /*
   * Create the root domain
   */
  await amplifyClient.mutate<
    CreateDomainMutation,
    CreateDomainMutationVariables
  >(CreateDomainDocument, {
    input: {
      id: `${checksummedAddress}_${Id.RootDomain}`,
      colonyId: checksummedAddress,
      isRoot: true,
      nativeId: Id.RootDomain,
      nativeSkillId: skillId.toString(),
      nativeFundingPotId: fundingPotId.toNumber(),
    },
  });
};
