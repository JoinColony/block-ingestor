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
  /*
   * Search for domain with skillId from Colony's domains. We paginate the query
   * just in case there are more domains than the query limit. We can stop searching
   * if we find a domain.
   */
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
  } while (!domain && nextToken);

  if (!domain) {
    verbose(
      `Not acting upon the ArbitraryReputationUpdate event as a domain with the skillId ${skillId} was not found`,
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
