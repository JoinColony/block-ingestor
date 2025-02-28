import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateDomainDocument,
  CreateDomainMutation,
  CreateDomainMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { NotificationCategory } from '~types/notifications';
import {
  toNumber,
  writeActionFromEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
} from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    blockNumber,
    transactionHash,
  } = event;
  const { domainId, agent: initiatorAddress } = event.args;
  const nativeDomainId = toNumber(domainId);
  const databaseDomainId = getDomainDatabaseId(colonyAddress, nativeDomainId);

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const [skillId, fundingPotId] = await colonyClient.getDomain(nativeDomainId, {
    blockTag: blockNumber,
  });

  await mutate<CreateDomainMutation, CreateDomainMutationVariables>(
    CreateDomainDocument,
    {
      input: {
        id: databaseDomainId,
        colonyId: colonyAddress,
        nativeId: nativeDomainId,
        isRoot: false,
        nativeFundingPotId: toNumber(fundingPotId),
        nativeSkillId: skillId.toString(),
      },
    },
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CreateDomain,
    fromDomainId: databaseDomainId,
    initiatorAddress,
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Admin,
  });
};
