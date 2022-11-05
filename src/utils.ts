import { ensureFile, readJson, writeJson } from 'fs-extra';
import path from 'path';

import { name } from '../package.json';

export const output = (...messages: any[]): void =>
  console.log(`[${name} ${new Date().toJSON()}]`, ...messages);

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
