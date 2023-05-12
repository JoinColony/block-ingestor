import { Id } from '@colony/colony-js';

import { ContractEvent } from '~types';
import {
  writeActionFromEvent,
  getColonyTokenAddress,
  getDomainDatabaseId,
} from '~utils';
import { ColonyActionType } from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, who: recipientAddress, amount } = event.args;

  const tokenAddress = await getColonyTokenAddress(colonyAddress);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MintTokens,
    initiatorAddress,
    recipientAddress,
    amount: amount.toString(),
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
