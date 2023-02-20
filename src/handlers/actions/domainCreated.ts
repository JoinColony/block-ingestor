import { ColonyActionType, ContractEvent } from '~/types';
import { toNumber, writeActionFromEvent } from '~/utils';
import { getDatabaseDomainId } from '~/utils/domains';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { domainId } = event.args;
  const nativeDomainId = toNumber(domainId);

  writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CreateDomain,
    fromDomainId: getDatabaseDomainId(colonyAddress, nativeDomainId),
  });
};
