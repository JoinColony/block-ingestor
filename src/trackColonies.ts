import dotenv from 'dotenv';
import { utils, BigNumber } from 'ethers';
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
    const { args: { colonyAddress, token } } = networkClient.interface.parseLog(log) || {};
    colonies.add(JSON.stringify({
      colonyAddress,
      nativeTokenAddress: token,
      balance: BigNumber.from(0),
      unclaimedBalance: BigNumber.from(0),
    }));
    return null;
  });

  await writeJsonStats({ trackedColonies: colonies.size });

  output('Fetched', colonies.size, 'currently deployed colonies');

  const colonyAddedFilter = {
    address: networkClient.address,
    topics: [utils.id(ContractEventsSignatures.ColonyAdded)],
  };

  verbose(`Adding "${ContractEventsSignatures.ColonyAdded}" event listener`);

  provider.on(colonyAddedFilter, async (log) => {
    addEvent(networkClient.interface.parseLog(log) as ContractEvent);
  });
};
