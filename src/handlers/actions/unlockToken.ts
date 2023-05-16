import { Id } from '@colony/colony-js';

import {
  ColonyActionType,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { mutate } from '~amplifyClient';
import {
  writeActionFromEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const tokenAddress = await colonyClient.getToken();

  await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
    UpdateColonyDocument,
    {
      input: {
        id: colonyAddress,
        status: {
          nativeToken: {
            unlocked: true,
          },
        },
      },
    },
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.UnlockToken,
    initiatorAddress,
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
