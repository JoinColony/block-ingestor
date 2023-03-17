import { BigNumber } from 'ethers';

import { Id, getEvents } from '@colony/colony-js';
import networkClient from '~networkClient';
import { ColonyActionType, ContractEvent } from '~types';
import { toNumber, writeActionFromEvent, getDomainDatabaseId, findAsyncSequential } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, user: userAddress, skillId, amount } = event.args;

  const isReputationChangePositive = BigNumber.from(amount).gt(0);

  const actionType = isReputationChangePositive ? ColonyActionType.EmitDomainReputationReward : ColonyActionType.EmitDomainReputationPenalty;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const domainAddedFilter = colonyClient.filters.DomainAdded(null, null);
  const domainAddedEvents = await getEvents(colonyClient, domainAddedFilter);

  const changeDomain = await findAsyncSequential(domainAddedEvents, async (domain) => {
    const domainId = domain.args.domainId.toString();
    const { skillId: domainSkillId } = await colonyClient.getDomain(domainId);
    return domainSkillId.eq(skillId);
  });

  const changeDomainId = changeDomain ? changeDomain?.args.domainId.toString() : Id.RootDomain;

  await writeActionFromEvent(event, colonyAddress, {
    type: actionType,
    initiatorAddress,
    recipientAddress: userAddress,
    skillId: toNumber(skillId),
    amount: amount.toString(),
    fromDomainId: getDomainDatabaseId(colonyAddress, changeDomainId),
  });
};
