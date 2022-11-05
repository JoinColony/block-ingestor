import dotenv from 'dotenv';
import { utils } from 'ethers';
import { getLogs } from '@colony/colony-js';

import networkClient from './networkClient';
import { output, writeJsonStats, verbose } from './utils';
import { addEvent } from './eventQueue';
import { ContractEvent, ContractEventsSignatures } from './types';

dotenv.config();

export const coloniesSet = new Set();

export default async (): Promise<void> => {
  const { provider } = networkClient;

  const colonies = coloniesSet;

  verbose('Fetching already deployed colonies');

  const colonyAddedLogs = await getLogs(
    networkClient,
    networkClient.filters.ColonyAdded(),
  );

  colonyAddedLogs.map(log => {
    const { args: { colonyAddress } } = networkClient.interface.parseLog(log) || {};
    colonies.add(colonyAddress);
    return null;
  });

  await writeJsonStats({ trackedColonies: colonies.size });

  output('Tracking', colonies.size, 'currently deployed colonies');

  const colonyAddedFilter = {
    address: networkClient.address,
    topics: [utils.id(ContractEventsSignatures.ColonyAdded)],
  };

  verbose('Added listener for event:', ContractEventsSignatures.ColonyAdded);

  provider.on(colonyAddedFilter, async (log) => {
    addEvent(networkClient.interface.parseLog(log) as ContractEvent);
  });
};
