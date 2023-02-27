import {
  AnyColonyClient,
  ColonyClientV1,
  ColonyClientV2,
  ColonyClientV3,
  ColonyClientV4,
} from '@colony/colony-js';
import { BigNumber } from 'ethers';
import networkClient from '~/networkClient';
import { ColonyActionType, ContractEvent } from '~/types';
import { toNumber, writeActionFromEvent, getDomainDatabaseId } from '~/utils';

/**
 * The handler makes use of colonyClient getDomainFromFundingPot method which is only
 * available on ColonyClientV5 and above. The following type predicate allows to check
 * we're dealing with a client that supports this method
 */
type SupportedColonyClient = Exclude<
  AnyColonyClient,
  ColonyClientV1 | ColonyClientV2 | ColonyClientV3 | ColonyClientV4
>;
const isSupportedColonyClient = (
  colonyClient: AnyColonyClient,
): colonyClient is SupportedColonyClient =>
  (colonyClient as SupportedColonyClient).getDomainFromFundingPot !== undefined;

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const {
    agent: initiatorAddress,
    token: tokenAddress,
    amount,
    fromPot,
    toPot,
  } = event.args;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  let fromDomainId: BigNumber | undefined;
  let toDomainId: BigNumber | undefined;
  if (isSupportedColonyClient(colonyClient)) {
    fromDomainId = await colonyClient.getDomainFromFundingPot(fromPot);
    toDomainId = await colonyClient.getDomainFromFundingPot(toPot);
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MoveFunds,
    initiatorAddress,
    tokenAddress,
    amount: amount.toString(),
    fromDomainId: fromDomainId
      ? getDomainDatabaseId(colonyAddress, toNumber(fromDomainId))
      : undefined,
    toDomainId: toDomainId
      ? getDomainDatabaseId(colonyAddress, toNumber(toDomainId))
      : undefined,
  });
};
