import { getLogs } from '@colony/colony-js';
import { utils } from 'ethers';

import {
  handleMintTokensAction,
  handlePaymentAction,
  handleTokenUnlockedAction,
} from '~handlers';
import networkClient from '~networkClient';
import { ColonyActionHandler, ContractEventsSignatures } from '~types';
import { getCachedColonyClient, mapLogToContractEvent, verbose } from '~utils';

// The Filter type doesn't seem to be exported from colony-js
type Filter = Parameters<typeof getLogs>[1];

const getFilter = (
  eventSignature: ContractEventsSignatures,
  colonyAddress: string,
): Filter => ({
  topics: [utils.id(eventSignature)],
  address: colonyAddress,
});

const trackActionsByEvent = async (
  eventSignature: ContractEventsSignatures,
  colonyAddress: string,
  handler: ColonyActionHandler,
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const filter = getFilter(eventSignature, colonyAddress);
  const logs = await getLogs(networkClient, filter);
  logs.forEach(async (log) => {
    console.log(log);
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }

    handler(event);
  });
};

export default async (colonyAddress: string): Promise<void> => {
  verbose('Fetching past actions for colony:', colonyAddress);
  await trackActionsByEvent(
    ContractEventsSignatures.TokensMinted,
    colonyAddress,
    handleMintTokensAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.PaymentAdded,
    colonyAddress,
    handlePaymentAction,
  );
  await trackActionsByEvent(
    ContractEventsSignatures.TokenUnlocked,
    colonyAddress,
    handleTokenUnlockedAction,
  );
};
