import {
  CreateSupportedChainDocument,
  CreateSupportedChainMutation,
  CreateSupportedChainMutationVariables,
  GetSupportedChainDocument,
  GetSupportedChainQuery,
  GetSupportedChainQueryVariables,
} from '@joincolony/graphql';
import { output } from '@joincolony/utils';
import amplifyClient from '~amplifyClient';
import rpcProvider from '~provider';

export const addChainToDB = async (): Promise<void> => {
  const chainId = rpcProvider.getChainId();

  if (!chainId) {
    return;
  }

  const supportedChain = await amplifyClient.query<
    GetSupportedChainQuery,
    GetSupportedChainQueryVariables
  >(GetSupportedChainDocument, {
    id: chainId.toString(),
  });

  if (supportedChain?.data?.getSupportedChain?.id) {
    output(`Supported chain with ${chainId} already exists in the db.`);
    return;
  }

  await amplifyClient.mutate<
    CreateSupportedChainMutation,
    CreateSupportedChainMutationVariables
  >(CreateSupportedChainDocument, {
    input: {
      id: chainId.toString(),
      isActive: true,
    },
  });
};
