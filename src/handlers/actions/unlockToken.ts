import { Id } from '@colony/colony-js';

import {
  ColonyActionType,
  GetColonyStatusDocument,
  GetColonyStatusQuery,
  GetColonyStatusQueryVariables,
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
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const tokenAddress = await colonyClient.getToken();

  const { data } =
    (await query<GetColonyStatusQuery, GetColonyStatusQueryVariables>(
      GetColonyStatusDocument,
      {
        id: colonyAddress,
      },
    )) ?? {};

  if (data?.getColony) {
    await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
      UpdateColonyDocument,
      {
        input: {
          id: colonyAddress,
          status: {
            ...data.getColony.status,
            nativeToken: {
              ...data.getColony.status?.nativeToken,
              unlocked: true,
            },
          },
        },
      },
    );
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.UnlockToken,
    initiatorAddress,
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
