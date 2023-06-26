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

export const getLastBlockNumber = (): number =>
  Number.isInteger(stats.lastBlockNumber) ? Number(stats.lastBlockNumber) : 1;

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
    await mutate<CreateStatsMutation, CreateStatsMutationVariables>(
      CreateStatsDocument,
      {
        value: JSON.stringify({}),
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
