import { AnyColonyClient, getLogs } from '@colony/colony-js';
import { utils } from 'ethers';

import {
  handleMintTokensAction,
  handlePaymentAction,
  handleTokenUnlockedAction,
} from '~handlers';
import networkClient from '~networkClient';
import { ContractEventsSignatures } from '~types';
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

const trackMintTokensActions = async (
  colonyAddress: string,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const tokensMintedFilter = getFilter(
    ContractEventsSignatures.TokensMinted,
    colonyAddress,
  );
  const tokensMintedLogs = await getLogs(networkClient, tokensMintedFilter);
  tokensMintedLogs.forEach(async (log) => {
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }

    await handleMintTokensAction(event);
  });
};

const trackCreatePaymentActions = async (
  colonyAddress: string,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const paymentAddedFilter = getFilter(
    ContractEventsSignatures.PaymentAdded,
    colonyAddress,
  );
  const paymentAddedLogs = await getLogs(networkClient, paymentAddedFilter);
  paymentAddedLogs.forEach(async (log) => {
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }

    await handlePaymentAction(event);
  });
};

const trackUnlockTokenActions = async (
  colonyAddress: string,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const tokenUnlockedFilter = getFilter(
    ContractEventsSignatures.TokenUnlocked,
    colonyAddress,
  );
  const tokenUnlockedLogs = await getLogs(networkClient, tokenUnlockedFilter);
  tokenUnlockedLogs.forEach(async (log) => {
    const event = await mapLogToContractEvent(log, colonyClient.interface);
    if (!event) {
      return;
    }

    await handleTokenUnlockedAction(event);
  });
};

export default async (colonyAddress: string): Promise<void> => {
  verbose('Fetching past actions for colony:', colonyAddress);
  const colonyClient = await getCachedColonyClient(colonyAddress);
  await trackMintTokensActions(colonyAddress, colonyClient);
  await trackCreatePaymentActions(colonyAddress, colonyClient);
  await trackUnlockTokenActions(colonyAddress, colonyClient);
};
