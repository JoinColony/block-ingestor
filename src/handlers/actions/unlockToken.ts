import { Id } from '@colony/colony-js';

import {
  ColonyActionType,
  GetColonyByNativeTokenIdDocument,
  GetColonyByNativeTokenIdQuery,
  GetColonyByNativeTokenIdQueryVariables,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { mutate, query } from '~amplifyClient';
import {
  writeActionFromEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
  notNull,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const tokenAddress = await colonyClient.getToken();
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
              unlocked: true,
            },
          },
        },
      },
    );
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.UnlockToken,
    initiatorAddress,
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
