import dotenv from 'dotenv';
import { utils } from 'ethers';
import { getLogs } from '@colony/colony-js';

import networkClient from './networkClient';
import { output, writeJsonStats } from './utils';
import { addEvent } from './eventQueue';
import { ContractEvent, ContractEventsSignatures } from './types';

dotenv.config();

export const coloniesSet = new Set();

export default async (): Promise<void> => {
  const { provider } = networkClient;

  const colonies = coloniesSet;

  output('Fetching already deployed colonies');

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
    topics: [utils.id(ContractEventsSignatures.ColonyAdded)],
  };

  output(`Adding "${ContractEventsSignatures.ColonyAdded}" event listener`);

  provider.on(colonyAddedFilter, async (log) => {
    addEvent(networkClient.interface.parseLog(log) as ContractEvent);
  });
};
