import {
  CreateSupportedChainDocument,
  CreateSupportedChainMutation,
  CreateSupportedChainMutationVariables,
  GetSupportedChainDocument,
  GetSupportedChainQuery,
  GetSupportedChainQueryVariables,
  UpdateSupportedChainDocument,
  UpdateSupportedChainMutation,
  UpdateSupportedChainMutationVariables,
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

  const mutationPayload = {
    input: {
      id: chainId.toString(),
      isActive: true,
    },
  };

  if (supportedChain?.data?.getSupportedChain?.id) {
    output(
      `Supported chain with id ${chainId} already exists in the db. Will be enabled.`,
    );
    await amplifyClient.mutate<
      UpdateSupportedChainMutation,
      UpdateSupportedChainMutationVariables
    >(UpdateSupportedChainDocument, mutationPayload);
    return;
  }

  await amplifyClient.mutate<
    CreateSupportedChainMutation,
    CreateSupportedChainMutationVariables
  >(CreateSupportedChainDocument, mutationPayload);
};
