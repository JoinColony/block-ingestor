import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import { NotificationCategory } from '~types/notifications';
import { toNumber, writeActionFromEvent } from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';
import { verbose } from '@joincolony/utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { newVersion, agent: initiatorAddress } = event.args;
  const convertedVersion = toNumber(newVersion);

  verbose('Colony:', colonyAddress, `upgraded to version ${convertedVersion}`);

  // Update colony version in the db
  await amplifyClient.mutate<
    UpdateColonyMutation,
    UpdateColonyMutationVariables
  >(UpdateColonyDocument, {
    input: {
      id: event.contractAddress,
      version: convertedVersion,
    },
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.VersionUpgrade,
    initiatorAddress,
    newColonyVersion: convertedVersion,
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Admin,
  });
};
