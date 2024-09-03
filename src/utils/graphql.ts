import dotenv from 'dotenv';
import { DocumentNode, Kind, isExecutableDefinitionNode } from 'graphql';

import { query } from '~amplifyClient';

dotenv.config();

interface GetDataResponse<TItem> {
  items: Array<TItem | null> | undefined;
  nextToken?: string | null;
}

export type GetDataFn<T, K> = (
  params: K,
  nextToken?: string | null,
) => Promise<GetDataResponse<T> | null | undefined>;

export const getAllPagesOfData = async <T, K>(
  getDataFunc: GetDataFn<T, K>,
  params: K,
): Promise<Array<T | null>> => {
  const items = [];
  let nextToken = null;

  do {
    const data: GetDataResponse<T> | null | undefined = await getDataFunc(
      { ...params },
      nextToken,
    );
    nextToken = data?.nextToken;
    if (data?.items) {
      items.push(...data.items);
    }
  } while (nextToken);

  return items;
};

export const delay = async (timeout: number): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const tryFetchGraphqlQuery = async <
  TVariables extends Record<string, unknown> = {},
>(
  queryString: DocumentNode,
  variables?: TVariables,
  maxRetries: number = 3,
  blockTime: number = process.env.BLOCK_TIME
    ? parseInt(process.env.BLOCK_TIME, 10) * 1000
    : 5000,
): Promise<any> => {
  let currentTry = 0;

  while (true) {
    const result = await query<Record<string, unknown>, TVariables>(
      queryString,
      variables,
    );

    /*
     * @NOTE That this limits to only fetching one operation at a time
     */

    const queryFieldName = extractQueryFieldName(queryString);

    if (result?.data?.[queryFieldName]) {
      return result.data;
    }

    if (currentTry < maxRetries) {
      await delay(blockTime);
      currentTry += 1;
    } else {
      throw new Error('Could not fetch graphql data in time');
    }
  }
};

const extractQueryFieldName = (queryString: DocumentNode): string => {
  const definitionNode = queryString.definitions[0];

  if (!isExecutableDefinitionNode(definitionNode)) {
    throw new Error('Could not extract query field name');
  }

  const selectionNode = definitionNode.selectionSet.selections[0];
  if (selectionNode.kind !== Kind.FIELD) {
    throw new Error('Could not extract query field name');
  }

  return selectionNode.name.value;
};
