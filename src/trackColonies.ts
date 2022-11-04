import dotenv from 'dotenv';
import { utils } from 'ethers';
import { getLogs } from '@colony/colony-js';

import networkClient from './networkClient';
import { output, writeJsonStats } from './utils';

dotenv.config();

export default async (): Promise<void> => {
  const { provider } = networkClient;

  const colonies = new Set();

  output('Fetching initial colonies');

  const colonyAddedLogs = await getLogs(
    networkClient,
    networkClient.filters.ColonyAdded(),
  );

  colonyAddedLogs.map(log => {
    const { args: { colonyAddress, token } } = networkClient.interface.parseLog(log) || {};
    colonies.add(JSON.stringify({ colonyAddress, tokenAddress: token }));
    return null;
  });

  await writeJsonStats({ trackedColonies: colonies.size });

  output('Fetched', colonies.size, 'colonies in total');

  const colonyAddedFilter = {
    address: networkClient.address,
    topics: [utils.id('ColonyAdded(uint256,address,address)')],
  };

  output('Starting "ColonyAdded(uint256,address,address)" event listener');

  provider.on(colonyAddedFilter, async (log) => {
    const { args: { colonyAddress, token } } = networkClient.interface.parseLog(log) || {};
    colonies.add(JSON.stringify({ colonyAddress, tokenAddress: token }));
    await writeJsonStats({ trackedColonies: colonies.size });
    output('Found new Colony:', colonyAddress, 'Total colonies:', colonies.size);
  });
};
