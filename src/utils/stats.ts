import { mutate, query } from '~amplifyClient';
import {
  CreateStatsDocument,
  CreateStatsMutation,
  CreateStatsMutationVariables,
  GetStatsDocument,
  GetStatsQuery,
  GetStatsQueryVariables,
  UpdateStatsDocument,
  UpdateStatsMutation,
  UpdateStatsMutationVariables,
} from '~graphql';

import { output, verbose } from './logger';

let stats: Record<string, unknown> = {};

type ObjectOrFunction =
  | Record<string, unknown>
  | ((jsonFile: Record<string, unknown>) => Record<string, unknown>);

/*
 * Update stats with a given argument
 * It accepts either a object fragment (or full object) that will get appended to the stats,
 * or a callback (which receives the current stats) and needs to return the new object
 * that will be written back
 */
export const updateStats = async (
  objectOrFunction: ObjectOrFunction,
): Promise<void> => {
  if (typeof objectOrFunction === 'function') {
    stats = {
      ...stats,
      ...objectOrFunction(stats),
    };
  } else {
    stats = {
      ...stats,
      ...objectOrFunction,
    };
  }

  await mutate<UpdateStatsMutation, UpdateStatsMutationVariables>(
    UpdateStatsDocument,
    {
      value: JSON.stringify(stats),
    },
  );

  verbose('Stats file updated');
};

// This exists as a function to prevent accidental overwriting of the `stats` variable
export const getStats = (): typeof stats => ({ ...stats });

export const getLastBlockNumber = (): number => {
  if (Number.isInteger(stats.lastBlockNumber)) {
    return Number(stats.lastBlockNumber);
  }
  /*
   * @NOTE This prevents accidental database stats overwriting if the API / GraphQL
   * endpoint is not accessible
   *
   * It will throw the block ingestor (the pod that it's running on) into an restart
   * loop until the API is accessible again
   */
  throw new Error('Could not get last block number from stats. Aborting.');
};

export const setLastBlockNumber = (lastBlockNumber: number): void => {
  updateStats({ lastBlockNumber });
};

/**
 * Function fetching the last stored stats from the DB
 * If no stats entry is found, it will create one
 */
export const initStats = async (): Promise<void> => {
  const { value: jsonStats } =
    (await query<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, {}))
      ?.data?.getIngestorStats ?? {};

  if (!jsonStats) {
    stats = {
      lastBlockNumber: 1,
    };

    await mutate<CreateStatsMutation, CreateStatsMutationVariables>(
      CreateStatsDocument,
      {
        value: JSON.stringify(stats),
      },
    );
  } else {
    try {
      stats = JSON.parse(jsonStats);
    } catch {
      output(
        'Could not parse stats from the DB. The value is not a valid JSON.',
      );
    }
  }
};
