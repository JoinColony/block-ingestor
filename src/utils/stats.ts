import storage from 'node-persist';

import { verbose } from './logger';

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
  const port = process.env.STATS_PORT;
  if (!port) {
    verbose('Stats are DISABLED, no point in writing to the stats file');
    /*
     * If the port isn't set, it means the stats are disabled, so there's no point
     * in keep writing the stats file, so we exit early
     */
    return;
  }

  let newStats = {};
  const currentStats = (await storage.getItem('stats')) ?? {};

  if (typeof objectOrFunction === 'function') {
    newStats = {
      ...currentStats,
      ...objectOrFunction(currentStats),
    };
  } else {
    newStats = {
      ...currentStats,
      ...objectOrFunction,
    };
  }

  await storage.setItem('stats', newStats);
  verbose('Stats file updated');
};

export const getStats = async (): Promise<Record<string, unknown>> => {
  const stats = (await storage.getItem('stats')) ?? {};
  return stats;
};

export const getLatestBlock = async (): Promise<number> => {
  const stats = await getStats();
  return Number(stats.latestBlock ?? 1);
};
