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
  while (true) {
    const result = await query(queryString, variables);

    /*
     * @NOTE That this limits to only fetching one operation at a time
     */
    if (result?.data) {
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
