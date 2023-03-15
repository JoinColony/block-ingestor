import { BigNumber } from 'ethers';

import { Id, getEvents } from '@colony/colony-js';
import networkClient from '~/networkClient';
import { ColonyActionType, ContractEvent } from '~/types';
import { toNumber, writeActionFromEvent, getDomainDatabaseId } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, user: userAddress, skillId, amount } = event.args;

  const isReputationChangePositive = BigNumber.from(amount).gt(0);

  const actionType = isReputationChangePositive ? ColonyActionType.EmitDomainReputationReward : ColonyActionType.EmitDomainReputationPenalty;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const domainAddedFilter = colonyClient.filters.DomainAdded(null, null);
  const domainAddedEvents = await getEvents(colonyClient, domainAddedFilter);

  const colonyDomains = await Promise.all(
    domainAddedEvents.map(async (domain) => {
      const domainId = domain.args.domainId.toString();
      const { skillId } = await colonyClient.getDomain(domainId);
      return {
        skillId,
        domainId,
      };
    }),
  );

  const changeDomain = colonyDomains.find((domain) =>
    domain.skillId.eq(skillId),
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: actionType,
    initiatorAddress,
    recipientAddress: userAddress,
    skillId: toNumber(skillId),
    amount: amount.toString(),
    fromDomainId: getDomainDatabaseId(colonyAddress, changeDomain?.domainId ?? Id.RootDomain),
  });
};
