import { BigNumber } from 'ethers';

import { ContractEvent } from '~types';
import { writeActionFromEvent, verbose, notNull } from '~utils';
import {
  ColonyActionType,
  GetColonyDocument,
  GetColonyQuery,
  GetColonyQueryVariables,
} from '~graphql';
import { query } from '~amplifyClient';

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

  let domain;
  let nextToken: string | undefined;
  do {
    const { data } =
      (await query<GetColonyQuery, GetColonyQueryVariables>(GetColonyDocument, {
        id: colonyAddress,
        nextToken,
      })) ?? {};
    domain = data?.getColony?.domains?.items
      .filter(notNull)
      .find(
        ({ nativeSkillId }) => nativeSkillId.toString() === skillId.toString(),
      );

    nextToken = data?.getColony?.domains?.nextToken ?? '';

    if (domain ?? (!domain && !nextToken)) {
      break;
    }
  } while (true);

  if (!domain) {
    verbose(
      'Not acting upon the ArbitraryReputationUpdate event as a domain with the skillId was not found',
    );
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: actionType,
    initiatorAddress,
    recipientAddress: userAddress,
    amount: amount.toString(),
    fromDomainId: domain.id,
  });
};
