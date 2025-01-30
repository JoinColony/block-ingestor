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
  EnableProxyColonyOperation,
  getColonyFromDB,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';
import amplifyClient from '~amplifyClient';

export const handleEnableProxyColony = async (
  event: ContractEvent,
  operation: EnableProxyColonyOperation,
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

  // If the proxy colony is already enabled, we early-return
  if (item?.data?.getProxyColony?.isActive) {
    return;
  }

  await amplifyClient.mutate<
    UpdateProxyColonyMutation,
    UpdateProxyColonyMutationVariables
  >(UpdateProxyColonyDocument, {
    input: {
      id: proxyColonyId,
      isActive: true,
    },
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.AddProxyColony,
    initiatorAddress,
    targetChainId: Number(foreignChainId),
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
