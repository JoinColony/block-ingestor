import dotenv from 'dotenv';
import { getLogs } from '@colony/colony-js';

import networkClient from './networkClient';
import { output, writeJsonStats, verbose, addNetworkEventListener, setToJS } from './utils';
import { colonySpecificEventsListener } from './eventListener';
import { ContractEventsSignatures } from './types';

dotenv.config();

export const coloniesSet = new Set<string>();

export default async (): Promise<void> => {
  const colonies = coloniesSet;

  verbose('Fetching already deployed colonies');

  /*
   * Get all currently deployed colonies (using events)
   */
  const colonyAddedLogs = await getLogs(
    networkClient,
    networkClient.filters.ColonyAdded(),
  );

  colonyAddedLogs.map(log => {
    const { args: { colonyAddress, token: tokenAddress } } = networkClient.interface.parseLog(log) || {};
    /*
     * Add found colonies to a Set
     * - We're using a Set to ensure uniquess
     * - We're using a JSON string since we need to store two values, colony address and token
     */
    colonies.add(JSON.stringify({ colonyAddress, tokenAddress }));
    return null;
  });

  await writeJsonStats({ trackedColonies: colonies.size });

  output('Tracking', colonies.size, 'currently deployed colonies');

  /*
   * Once we found all current colonies, setup all Colony related listeners we care about
   */
  await Promise.all(
    setToJS(coloniesSet).map(
      async ({ colonyAddress }) => await colonySpecificEventsListener(colonyAddress),
    ),
  );

  /*
   * Set a Network level listener to track new colonies that will get created on chain
   */
  await addNetworkEventListener(ContractEventsSignatures.ColonyAdded);
};
