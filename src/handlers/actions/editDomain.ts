import { ColonyActionType } from '~graphql';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  toNumber,
  verbose,
  writeActionFromEvent,
  getDomainDatabaseId,
  transactionHasEvent,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const hasDomainAddedEvent = await transactionHasEvent(
    event.transactionHash,
    ContractEventsSignatures.DomainAdded,
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
