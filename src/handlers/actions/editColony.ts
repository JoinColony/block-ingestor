import { Id } from '@colony/colony-js';

import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import { getDomainDatabaseId, writeActionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  console.log('EDITING COLONY');
  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ColonyEdit,
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
