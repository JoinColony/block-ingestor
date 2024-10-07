import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  UpdateColonyDocument,
  UpdateColonyMutation,
  UpdateColonyMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { toNumber, verbose, writeActionFromEvent } from '~utils';
import {
  NotificationCategory,
  sendPermissionsActionNotifications,
} from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { newVersion, agent: initiatorAddress } = event.args;
  const convertedVersion = toNumber(newVersion);

  verbose('Colony:', colonyAddress, `upgraded to version ${convertedVersion}`);

  // Update colony version in the db
  await mutate<UpdateColonyMutation, UpdateColonyMutationVariables>(
    UpdateColonyDocument,
    {
      input: {
        id: event.contractAddress,
        version: convertedVersion,
      },
    },
  );

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
