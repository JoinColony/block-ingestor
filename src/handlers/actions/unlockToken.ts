import { Id } from '@colony/colony-js';

import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import { NotificationCategory } from '~types/notifications';
import {
  writeActionFromEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
  updateColoniesNativeTokenStatuses,
} from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    blockNumber,
    transactionHash,
  } = event;
  const { agent: initiatorAddress } = event.args;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const tokenAddress = await colonyClient.getToken({ blockTag: blockNumber });

  // update all colonies that have this token as their native token
  await updateColoniesNativeTokenStatuses(tokenAddress, { unlocked: true });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.UnlockToken,
    initiatorAddress,
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Payment,
  });
};
