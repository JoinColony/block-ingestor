import { Id } from '@colony/colony-js';

import { ColonyActionType } from '@joincolony/graphql';
import { ContractEvent } from '~types';
import { NotificationCategory } from '~types/notifications';
import { getDomainDatabaseId, writeActionFromEvent } from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { agent: initiatorAddress } = event.args;

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ColonyEdit,
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Admin,
  });
};
