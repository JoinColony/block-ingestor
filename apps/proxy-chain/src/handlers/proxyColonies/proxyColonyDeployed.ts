import {
  CreateProxyColonyDocument,
  CreateProxyColonyMutation,
  CreateProxyColonyMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import amplifyClient from '~amplifyClient';
import rpcProvider from '~provider';
import { output } from '@joincolony/utils';

export const handleProxyColonyDeployed = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('proxy colony deployed event', event);
  const { proxyColony: proxyColonyAddress } = event.args;

  if (!proxyColonyAddress) {
    output('No proxyColony emitted!');
    return;
  }

  const chainId = rpcProvider.getChainId();

  await amplifyClient.mutate<
    CreateProxyColonyMutation,
    CreateProxyColonyMutationVariables
      >(CreateProxyColonyDocument, {
        input: {
          id: `${proxyColonyAddress}_${chainId}`,
        colonyAddress: proxyColonyAddress,
        chainId,
        isActive: true,
        },
      });
};
