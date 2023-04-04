import { mutate } from '~amplifyClient';
import { ColonyActionType, ContractEvent } from '~types';
import {
  toNumber,
  writeActionFromEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { domainId, agent: initiatorAddress } = event.args;
  const nativeDomainId = toNumber(domainId);
  const databaseDomainId = getDomainDatabaseId(colonyAddress, nativeDomainId);

  const colonyClient = await getCachedColonyClient(colonyAddress);
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
