import { constants } from 'ethers';
import amplifyClient from '~amplifyClient';
import {
  GetColonyExtensionByHashAndColonyDocument,
  GetColonyExtensionByHashAndColonyQuery,
  GetColonyExtensionByHashAndColonyQueryVariables,
  NotificationType,
} from '@joincolony/graphql';
import provider from '~provider';
import { ContractEvent } from '@joincolony/blocks';
import { verbose } from '@joincolony/utils';
import { updateExtension } from '~utils/extensions/updateExtension';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
import { getTransactionSignerAddress } from '~utils/transactions';

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

  const transaction = await provider
    .getProviderInstance()
    .getTransaction(transactionHash);

  const deprecatedBy =
    getTransactionSignerAddress(transaction) ?? constants.AddressZero;

  sendExtensionUpdateNotifications({
    colonyAddress: colony,
    creator: deprecatedBy,
    notificationType: deprecated
      ? NotificationType.ExtensionDeprecated
      : NotificationType.ExtensionEnabled,
    extensionHash,
  });

  const { data } =
    (await amplifyClient.query<
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
