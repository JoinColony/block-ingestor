import { Id } from '@colony/colony-js';
import {
  ColonyActionType,
  GetProxyColonyDocument,
  GetProxyColonyQuery,
  GetProxyColonyQueryVariables,
  UpdateProxyColonyDocument,
  UpdateProxyColonyMutation,
  UpdateProxyColonyMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import {
  DisableProxyColonyOperation,
  getColonyFromDB,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';
import amplifyClient from '~amplifyClient';

export const handleDisableProxyColony = async (
  event: ContractEvent,
  operation: DisableProxyColonyOperation,
): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  const foreignChainId = operation.payload[0];

  const colony = await getColonyFromDB(colonyAddress);
  if (!colony) {
    return;
  }

  const proxyColonyId = `${colonyAddress}_${foreignChainId}`;

  const item = await amplifyClient.query<
    GetProxyColonyQuery,
    GetProxyColonyQueryVariables
  >(GetProxyColonyDocument, {
    id: proxyColonyId,
  });

  // If the proxy colony is already disabled, we early-return
  if (!item?.data?.getProxyColony?.isActive) {
    return;
  }

  await amplifyClient.mutate<
    UpdateProxyColonyMutation,
    UpdateProxyColonyMutationVariables
  >(UpdateProxyColonyDocument, {
    input: {
      id: proxyColonyId,
      isActive: false,
    },
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.RemoveProxyColony,
    initiatorAddress,
    targetChainId: Number(foreignChainId),
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
