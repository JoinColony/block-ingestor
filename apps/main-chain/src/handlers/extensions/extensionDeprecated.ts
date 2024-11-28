import { constants } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetColonyExtensionByHashAndColonyDocument,
  GetColonyExtensionByHashAndColonyQuery,
  GetColonyExtensionByHashAndColonyQueryVariables,
  NotificationType,
} from '@joincolony/graphql';
import networkClient from '~networkClient';
import { ContractEvent } from '~types';
import { verbose } from '~utils';
import { updateExtension } from '~utils/extensions/updateExtension';
import { sendExtensionUpdateNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { transactionHash } = event;
  const { extensionId: extensionHash, colony, deprecated } = event.args;

  verbose(
    'Extension:',
    extensionHash,
    deprecated ? 'deprecated' : 're-enabled',
    'in Colony:',
    colony,
  );

  const receipt = await networkClient.provider.getTransactionReceipt(
    transactionHash,
  );

  sendExtensionUpdateNotifications({
    colonyAddress: colony,
    creator: receipt.from || constants.AddressZero,
    notificationType: deprecated
      ? NotificationType.ExtensionDeprecated
      : NotificationType.ExtensionEnabled,
    extensionHash,
  });

  const { data } =
    (await query<
      GetColonyExtensionByHashAndColonyQuery,
      GetColonyExtensionByHashAndColonyQueryVariables
    >(GetColonyExtensionByHashAndColonyDocument, {
      extensionHash,
      colonyAddress: colony,
    })) ?? {};

  const extensionId = data?.getExtensionByColonyAndHash?.items[0]?.id;

  if (extensionId) {
    await updateExtension(extensionId, { isDeprecated: deprecated });
  }
};
