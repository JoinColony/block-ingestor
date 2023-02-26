import { ColonyActionType, ContractEvent } from '~/types';
import { toNumber, writeActionFromEvent } from '~/utils';
import { getDomainDatabaseId } from '~/utils/domains';

// @TODO: Check if this really is EditDomain action as opposed to CreateDomain when created with some metadata
export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, domainId } = event.args;
  const nativeDomainId = toNumber(domainId);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.EditDomain,
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
  });
};
