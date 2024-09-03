import { Id } from '@colony/colony-js';
import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import {
  ManageTokensOperation,
  getApprovedTokenChanges,
  getColonyFromDB,
  getDomainDatabaseId,
  updateColonyTokens,
  writeActionFromEvent,
} from '~utils';
import {
  NotificationCategory,
  sendPermissionsActionNotifications,
} from '~utils/notifications';

export const handleManageTokens = async (
  event: ContractEvent,
  operation: ManageTokensOperation,
): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { agent: initiatorAddress } = event.args;

  const tokenAddresses = operation.payload;

  const colony = await getColonyFromDB(colonyAddress);

  if (!colony) {
    return;
  }

  const {
    existingTokenAddresses,
    modifiedTokenAddresses,
    unaffectedTokenAddresses,
  } = getApprovedTokenChanges({
    colony,
    tokenAddresses,
  });

  await updateColonyTokens(
    colony,
    existingTokenAddresses,
    modifiedTokenAddresses,
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ManageTokens,
    initiatorAddress,
    approvedTokenChanges: {
      added: modifiedTokenAddresses.added,
      removed: modifiedTokenAddresses.removed,
      unaffected: unaffectedTokenAddresses,
    },
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Payment,
  });
};
