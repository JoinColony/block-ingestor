import { utils } from 'ethers';

import { ContractEvent, ContractEventsSignatures } from '~types';
import provider from '~provider';
import { getCachedColonyClient, mapLogToContractEvent, toNumber } from '~utils';

export const getExpenditureFundingPotId = async (
  expenditureAddedEvent: ContractEvent,
): Promise<number | null> => {
  const { contractAddress: colonyAddress, transactionHash } =
    expenditureAddedEvent;

  const receipt = await provider.getTransactionReceipt(transactionHash);
  const fundingPotAddedLog = receipt.logs.find(
    (log) =>
      log.topics[0] === utils.id(ContractEventsSignatures.FundingPotAdded),
  );

  if (!fundingPotAddedLog) {
    return null;
  }

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  const fundingPotAddedEvent = await mapLogToContractEvent(
    fundingPotAddedLog,
    colonyClient.interface,
  );
  if (!fundingPotAddedEvent) {
    return null;
  }

  const fundingPotId = toNumber(fundingPotAddedEvent.args.fundingPotId);

  return fundingPotId;
};
