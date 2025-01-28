import {
  GetProxyColoniesDocument,
  GetProxyColoniesQuery,
  GetProxyColoniesQueryVariables,
  ProxyColonyFragment,
} from '@joincolony/graphql';
import amplifyClient from '~amplifyClient';
import { getAllPagesOfData, GetDataFn } from './graphql';
import rpcProvider from '~provider';

// @TODO move this and the graphql helpers in a utils package
export const notNull = <T>(x: T | null): x is T => x !== null;

const getProxyColoniesData: GetDataFn<ProxyColonyFragment, undefined> = async (
  _params,
  nextToken,
) => {
  const response = await amplifyClient.query<
    GetProxyColoniesQuery,
    GetProxyColoniesQueryVariables
  >(GetProxyColoniesDocument, {
    ...(nextToken ? { nextToken } : {}),
    chainId: rpcProvider.getChainId(),
  });

  return response?.data?.listProxyColonies;
};

export const getAllColoniesOnCurrentChain = async (): Promise<
  ProxyColonyFragment[]
> => {
  const allProxyColonies = await getAllPagesOfData(
    getProxyColoniesData,
    undefined,
  );

  return allProxyColonies.filter(notNull);
};
