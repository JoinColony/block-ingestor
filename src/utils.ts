import { ensureFile, readJson, writeJson } from 'fs-extra';
import path from 'path';

import { SortOrder } from './types';

export const output = (...messages: any[]): void =>
  console.log(`[TX Ingestor ${new Date().toJSON()}]`, ...messages);

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

export const writeJsonStats = async (
  objectOrFunction: Record<string, unknown> | ((jsonFile: Record<string, unknown>) => Record<string, unknown>),
  filePath = `${path.resolve(__dirname, '..')}/run/stats.json`,
): Promise<void> => {
  let newJsonContents = {};
  const curentJsonContents = await readJsonStats(filePath);

  if (typeof objectOrFunction === 'function') {
    newJsonContents = objectOrFunction(curentJsonContents);
  }

  newJsonContents = {
    ...curentJsonContents,
    ...objectOrFunction,
  };

  await writeJson(filePath, newJsonContents);
};

export const sortByPriority = (
  key: string,
  priorities: Record<string, number>,
  order = SortOrder.Asc,
): ((firstEntry: any, secondEntry: any) => number) => (firstEntry, secondEntry) => {
  if (
    !Object.prototype.hasOwnProperty.call(firstEntry, key) ||
    !Object.prototype.hasOwnProperty.call(secondEntry, key)
  ) {
    return 0;
  }

  const [maxPriority] = Object.values(priorities).sort().reverse();

  const first = (firstEntry[key] in priorities)
    ? priorities[firstEntry[key] as keyof typeof priorities]
    : maxPriority + 1;
  const second = (secondEntry[key] in priorities)
    ? priorities[secondEntry[key] as keyof typeof priorities]
    : maxPriority + 1;

  /*
   * Negative sort priority moves it to the back of the list
   */
  if (first < 0 || second < 0) {
    return -1;
  }

  let result = 0;
  if (first < second) {
    result = -1;
  } else if (first > second) {
    result = 1;
  }
  return (order === SortOrder.Desc) ? ~result : result;
};
