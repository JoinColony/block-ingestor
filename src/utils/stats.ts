import { ensureFile, readJson, writeJson } from 'fs-extra';
import path from 'path';

import { verbose } from './logger';

/*
 * Read a json file at a specified path.
 * If the file (including the path) doesn't exist, it will be created and seeded
 * with an empty object
 */
export const readJsonStats = async (
  filePath = `${path.resolve(__dirname, '..')}/run/stats.json`,
): Promise<Record<string, unknown>> => {
  await ensureFile(filePath);
  let jsonContents;
  try {
    jsonContents = await readJson(filePath);
    return jsonContents;
  } catch (error) {
    await writeJson(filePath, {});
    return {};
  }
};

type ObjectOrFunction =
  | Record<string, unknown>
  | ((jsonFile: Record<string, unknown>) => Record<string, unknown>);

/*
 * Write a json file at a specified path.
 * It accepts either a object fragment (or full object) that will get appended to the existing file,
 * or a callback (which receives the current version of the file) and needs to return the new object
 * that will be written back
 */
export const writeJsonStats = async (
  objectOrFunction: ObjectOrFunction,
  filePath = `${path.resolve(__dirname, '..')}/run/stats.json`,
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

  let newJsonContents = {};
  const curentJsonContents = await readJsonStats(filePath);

  if (typeof objectOrFunction === 'function') {
    newJsonContents = {
      ...curentJsonContents,
      ...objectOrFunction(curentJsonContents),
    };
  } else {
    newJsonContents = {
      ...curentJsonContents,
      ...objectOrFunction,
    };
  }

  await writeJson(filePath, newJsonContents);
  verbose('Stats file updated');
};
