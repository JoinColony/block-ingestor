import dotenv from 'dotenv';
import { DocumentNode } from 'graphql';

import { query } from '~amplifyClient';

dotenv.config();

export const delay = async (timeout: number): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const tryFetchGraphqlQuery = async (
  queryString: DocumentNode,
  variables?: Record<string, any>,
  maxRetries: number = 3,
  blockTime: number = process.env.BLOCK_TIME
    ? parseInt(process.env.BLOCK_TIME, 10) * 1000
    : 5000,
): Promise<any> => {
  let currentTry = 0;

  console.log({ currentTry, maxRetries, blockTime });

  while (true) {
    const result = await query(queryString, variables);

    /*
     * @NOTE That this limits to only fetching one operation at a time
     */

    console.log({ result });
    console.log(queryString.definitions[0]);

    // result.data.getColonyMetadata = null
    // @ts-expect-error
    if (result?.data?.getColonyMetadata) {
      return result.data;
    }

    console.log({ currentTry });

    if (currentTry < maxRetries) {
      await delay(blockTime);
      console.log('this should delay');
      currentTry += 1;
    } else {
      throw new Error('Could not fetch graphql data in time');
    }
  }
};
