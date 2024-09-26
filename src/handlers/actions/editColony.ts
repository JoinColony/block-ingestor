import { Id } from '@colony/colony-js';

import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import { getDomainDatabaseId, writeActionFromEvent } from '~utils';
import { sendActionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { agent: initiatorAddress } = event.args;

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ColonyEdit,
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });

  sendActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
  });
};
