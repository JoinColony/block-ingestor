import { mutate } from '~/amplifyClient';
import networkClient from '~/networkClient';
import { ColonyActionType, ContractEvent } from '~/types';
import { toNumber, writeActionFromEvent } from '~/utils';
import { getDatabaseDomainId } from '~/utils/domains';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { domainId, agent: initiatorAddress } = event.args;
  const nativeDomainId = toNumber(domainId);
  const databaseDomainId = getDatabaseDomainId(colonyAddress, nativeDomainId);

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const [skillId, fundingPotId] = await colonyClient.getDomain(nativeDomainId);

  await mutate('createDomain', {
    input: {
      id: databaseDomainId,
      colonyId: colonyAddress,
      nativeId: nativeDomainId,
      isRoot: false,
      nativeFundingPotId: toNumber(fundingPotId),
      nativeSkillId: toNumber(skillId),
    },
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CreateDomain,
    fromDomainId: databaseDomainId,
    initiatorAddress,
  });
};
