import { utils } from 'ethers';
import provider from '~/provider';
import {
  ColonyActionType,
  ContractEvent,
  ContractEventsSignatures,
} from '~/types';
import {
  toNumber,
  verbose,
  writeActionFromEvent,
  getDomainDatabaseId,
} from '~/utils';

// @TODO: Check if this really is EditDomain action as opposed to CreateDomain when created with some metadata
export default async (event: ContractEvent): Promise<void> => {
  const receipt = await provider.getTransactionReceipt(event.transactionHash);
  const hasDomainAddedEvent = receipt.logs.some((log) =>
    log.topics.includes(utils.id(ContractEventsSignatures.DomainAdded)),
  );
  if (hasDomainAddedEvent) {
    verbose(
      'Not acting upon the DomainMetadata event as a DomainAdded event was present in the same transaction',
    );
    return;
  }

  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, domainId } = event.args;
  const nativeDomainId = toNumber(domainId);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.EditDomain,
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
  });
};
