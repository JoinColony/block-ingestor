import { BigNumber } from 'ethers';
import { AnyColonyClient, getEvents } from '@colony/colony-js';
import { LogDescription } from 'ethers/lib/utils';

import { ContractEvent } from '~types';
import {
  writeActionFromEvent,
  getDomainDatabaseId,
  verbose,
  getCachedColonyClient,
} from '~utils';
import { ColonyActionType } from '~graphql';

const getChangeDomainId = async (
  domainAddedEvents: LogDescription[],
  colonyClient: AnyColonyClient,
  skillId: number,
): Promise<number | null> => {
  for (const event of domainAddedEvents) {
    const domainId = event.args.domainId.toString();
    const { skillId: domainSkillId } = await colonyClient.getDomain(domainId);
    if (domainSkillId.eq(skillId)) {
      return domainId;
    }
  }
  return null;
};

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const {
    agent: initiatorAddress,
    user: userAddress,
    skillId,
    amount,
  } = event.args;

  const isReputationChangePositive = BigNumber.from(amount).gt(0);

  const actionType = isReputationChangePositive
    ? ColonyActionType.EmitDomainReputationReward
    : ColonyActionType.EmitDomainReputationPenalty;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const domainAddedFilter = colonyClient.filters.DomainAdded(null, null);
  const domainAddedEvents = await getEvents(colonyClient, domainAddedFilter);
  const changeDomainId = await getChangeDomainId(
    domainAddedEvents,
    colonyClient,
    skillId,
  );

  if (!changeDomainId) {
    verbose(
      'Not acting upon the ArbitraryReputationUpdate event as a domain matching the skillId was not found',
    );
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: actionType,
    initiatorAddress,
    recipientAddress: userAddress,
    amount: amount.toString(),
    fromDomainId: getDomainDatabaseId(colonyAddress, changeDomainId),
  });
};
