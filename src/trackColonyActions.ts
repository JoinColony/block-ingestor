import { getLogs } from '@colony/colony-js';
import { utils } from 'ethers';

import { handleMintTokensAction } from '~handlers';
import networkClient from '~networkClient';
import { ContractEventsSignatures } from '~types';
import { mapLogToContractEvent, verbose } from '~utils';

export default async (colonyAddress: string): Promise<void> => {
  verbose('Fetching past actions for colony:', colonyAddress);
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const tokensMintedFilter = {
    topics: [utils.id(ContractEventsSignatures.TokensMinted)],
    address: colonyAddress,
  };
  const tokensMintedLogs = await getLogs(networkClient, tokensMintedFilter);
  tokensMintedLogs.forEach(async (log) => {
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }

    await handleMintTokensAction(event);
  });
};
