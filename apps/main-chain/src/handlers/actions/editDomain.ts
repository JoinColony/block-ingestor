import { ColonyActionType } from '@joincolony/graphql';
import { verbose } from '@joincolony/utils';
import { ContractEvent, ContractEventsSignatures } from '@joincolony/blocks';
import { NotificationCategory } from '~types/notifications';
import {
  toNumber,
  writeActionFromEvent,
  getDomainDatabaseId,
  transactionHasEvent,
} from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { args, contractAddress: colonyAddress, transactionHash } = event;

  const hasDomainAddedEvent = await transactionHasEvent(
    transactionHash,
    ContractEventsSignatures.DomainAdded,
  );

  if (hasDomainAddedEvent) {
    verbose(
      'Not acting upon the DomainMetadata event as a DomainAdded event was present in the same transaction',
    );
    return;
  }

  const { agent: initiatorAddress, domainId } = args;
  const nativeDomainId = toNumber(domainId);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.EditDomain,
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Admin,
  });
};
