import {
  CreateMultiChainInfoDocument,
  CreateMultiChainInfoInput,
  CreateMultiChainInfoMutation,
  CreateMultiChainInfoMutationVariables,
  GetMultiChainInfoDocument,
  GetMultiChainInfoQuery,
  GetMultiChainInfoQueryVariables,
  UpdateMultiChainInfoDocument,
  UpdateMultiChainInfoInput,
  UpdateMultiChainInfoMutation,
  UpdateMultiChainInfoMutationVariables,
} from '@joincolony/graphql';
import { AmplifyClient } from '@joincolony/clients';
import merge from 'lodash/merge';
import { upsertEntry } from './amplify';

export const getMultiChainInfoId = (txHash: string, chainId: number): string =>
  `${txHash}_${chainId}`;

export const upsertMultiChainInfo = async (
  amplifyClient: AmplifyClient,
  id: string,
  createInput: CreateMultiChainInfoInput,
  updateInput: UpdateMultiChainInfoInput,
): Promise<string | undefined> => {
  const getMultiChainInfo = async (): Promise<
    GetMultiChainInfoQuery['getMultiChainInfo']
  > => {
    const response = await amplifyClient.query<
      GetMultiChainInfoQuery,
      GetMultiChainInfoQueryVariables
    >(GetMultiChainInfoDocument, {
      id,
    });
    return response?.data?.getMultiChainInfo;
  };

  const createMultiChainInfo = async (): Promise<
    CreateMultiChainInfoMutation['createMultiChainInfo']
  > => {
    const response = await amplifyClient.mutate<
      CreateMultiChainInfoMutation,
      CreateMultiChainInfoMutationVariables
    >(CreateMultiChainInfoDocument, {
      input: createInput,
    });

    return response?.data?.createMultiChainInfo;
  };

  const updateMultiChainInfo = async (
    existing: UpdateMultiChainInfoMutation['updateMultiChainInfo'],
  ): Promise<UpdateMultiChainInfoMutation['updateMultiChainInfo']> => {
    const response = await amplifyClient.mutate<
      UpdateMultiChainInfoMutation,
      UpdateMultiChainInfoMutationVariables
    >(UpdateMultiChainInfoDocument, {
      input: {
        ...merge(existing, updateInput),
        completedOnMainChain:
          existing?.completedOnMainChain ??
          updateInput.completedOnMainChain ??
          false,
        completedOnProxyChain:
          existing?.completedOnProxyChain ??
          updateInput.completedOnProxyChain ??
          false,
      },
    });

    return response?.data?.updateMultiChainInfo;
  };

  const response = await upsertEntry({
    fetchItem: getMultiChainInfo,
    create: createMultiChainInfo,
    update: updateMultiChainInfo,
  });

  return response?.id ?? undefined;
};
