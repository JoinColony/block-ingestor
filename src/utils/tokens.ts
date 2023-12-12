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

/*
 * Update all colonies native token statuses based on all colonies
 * that have the token address as their native token
 */
export const updateColoniesNativeTokenStatuses = async (
  tokenAddress: string,
  nativeTokenStatus: Omit<NativeTokenStatus, '__typename'>,
): Promise<void> => {
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

  colonies.forEach(async (colony) => {
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
  });
};
