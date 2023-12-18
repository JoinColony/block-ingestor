import { mutate, query } from '~amplifyClient';

import { getCachedColonyClient } from './clients';
import { notNull } from './arrays';
import {
  Colony,
  CreateColonyTokensDocument,
  CreateColonyTokensMutation,
  CreateColonyTokensMutationVariables,
  DeleteColonyTokensDocument,
  DeleteColonyTokensMutation,
  DeleteColonyTokensMutationVariables,
  GetTokenFromEverywhereDocument,
  GetTokenFromEverywhereQuery,
  GetTokenFromEverywhereQueryVariables,
  PendingModifiedTokenAddresses,
  GetColonyByNativeTokenIdDocument,
  GetColonyByNativeTokenIdQuery,
  GetColonyByNativeTokenIdQueryVariables,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
  NativeTokenStatus,
} from '~graphql';
import { Colony as FullColony } from '~graphql/generated';

export const getColonyTokenAddress = async (
  colonyAddress: string,
): Promise<string | undefined> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (colonyClient) {
    const tokenAddress = await colonyClient.getToken();
    return tokenAddress;
  }
};

export const getExistingTokenAddresses = (colony: Colony): string[] =>
  colony.tokens?.items
    .map((tokenItem) => tokenItem?.tokenAddress)
    .filter((item): item is string => !!item) ?? [];

export const updateColonyTokens = async (
  colony: Colony,
  existingTokenAddresses: string[],
  { added, removed }: PendingModifiedTokenAddresses,
): Promise<void> => {
  const currentAddresses = new Set(existingTokenAddresses);
  added?.forEach(async (tokenAddress) => {
    if (!currentAddresses.has(tokenAddress)) {
      /**
       * Call the GetTokenFromEverywhere query to ensure the token
       * gets added to the DB if it doesn't already exist
       */
      const { data } =
        (await query<
          GetTokenFromEverywhereQuery,
          GetTokenFromEverywhereQueryVariables
        >(GetTokenFromEverywhereDocument, {
          input: {
            tokenAddress,
          },
        })) ?? {};

      const response = data?.getTokenFromEverywhere;
      /**
       * Only create colony/token entry in the DB if the token data was returned by the GetTokenFromEverywhereQuery.
       * Otherwise, it will cause any query referencing it to fail
       */
      if (response?.items?.length) {
        await mutate<
          CreateColonyTokensMutation,
          CreateColonyTokensMutationVariables
        >(CreateColonyTokensDocument, {
          input: {
            colonyID: colony.colonyAddress,
            tokenID: tokenAddress,
          },
        });
      }
    }
  });

  removed?.forEach(async (tokenAddress) => {
    // get the ID of the colony/token entry in the DB (this is separate from token or colony address)
    const { id: colonyTokenId } =
      colony.tokens?.items
        .filter(notNull)
        .find(({ tokenAddress: address }) => address === tokenAddress) ?? {};

    // If we can't find it, e.g. because it has already been removed by another motion, do nothing.
    if (colonyTokenId) {
      await mutate<
        DeleteColonyTokensMutation,
        DeleteColonyTokensMutationVariables
      >(DeleteColonyTokensDocument, {
        input: {
          id: colonyTokenId,
        },
      });
    }
  });
};

// Fetch all colonies that share the same native token
export const fetchColoniesByNativeToken = async (
  tokenAddress: string,
): Promise<
  Array<
    NonNullable<
      NonNullable<
        GetColonyByNativeTokenIdQuery['getColoniesByNativeTokenId']
      >['items'][number]
    >
  >
> => {
  const queryVariables: GetColonyByNativeTokenIdQueryVariables = {
    nativeTokenId: tokenAddress,
    limit: 1000,
  };

  const { data } =
    (await query<
      GetColonyByNativeTokenIdQuery,
      GetColonyByNativeTokenIdQueryVariables
    >(GetColonyByNativeTokenIdDocument, queryVariables)) ?? {};

  const colonies =
    data?.getColoniesByNativeTokenId?.items.filter(notNull) ?? [];
  queryVariables.nextToken = data?.getColoniesByNativeTokenId?.nextToken;

  while (queryVariables.nextToken) {
    const { data: nextData } =
      (await query<
        GetColonyByNativeTokenIdQuery,
        GetColonyByNativeTokenIdQueryVariables
      >(GetColonyByNativeTokenIdDocument, queryVariables)) ?? {};

    colonies.push(
      ...(nextData?.getColoniesByNativeTokenId?.items.filter(notNull) ?? []),
    );

    queryVariables.nextToken = nextData?.getColoniesByNativeTokenId?.nextToken;
  }

  return colonies;
};

// Update a colony's native token status
export const updateSingleColonyNativeTokenStatuses = async (
  colony: Pick<FullColony, 'id' | 'status'>,
  nativeTokenStatus: Omit<NativeTokenStatus, '__typename'>,
): Promise<void> => {
  await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
    UpdateColonyDocument,
    {
      input: {
        id: colony.id,
        status: {
          ...colony.status,
          nativeToken: {
            ...colony.status?.nativeToken,
            ...nativeTokenStatus,
          },
        },
      },
    },
  );
};

/*
 * Update all colonies native token statuses based on all colonies
 * that have the token address as their native token
 */
export const updateColoniesNativeTokenStatuses = async (
  tokenAddress: string,
  nativeTokenStatus: Omit<NativeTokenStatus, '__typename'>,
): Promise<void> => {
  const colonies = await fetchColoniesByNativeToken(tokenAddress);

  for (const colony of colonies) {
    await updateSingleColonyNativeTokenStatuses(colony, nativeTokenStatus);
  }
};
