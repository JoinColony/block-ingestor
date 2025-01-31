import { constants } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetColonyExtensionByAddressDocument,
  GetColonyExtensionByAddressQuery,
  GetColonyExtensionByAddressQueryVariables,
  NotificationType,
} from '~graphql';
import provider from '~provider';
import { EventHandler } from '~types';
import { updateExtension } from '~utils/extensions/updateExtension';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
import { getTransactionSignerAddress } from '~utils/transactions';

export const handleMultiSigGlobalThresholdSet: EventHandler = async (event) => {
  const { contractAddress: multiSigAddress, transactionHash } = event;
  const { globalThreshold } = event.args;

  const colonyExtensionsResponse = await query<
    GetColonyExtensionByAddressQuery,
    GetColonyExtensionByAddressQueryVariables
  >(GetColonyExtensionByAddressDocument, {
    extensionAddress: multiSigAddress,
  });

  const { multiSig } =
    colonyExtensionsResponse?.data?.getColonyExtension?.params ?? {};

  let colonyDomains;

  if (multiSig) {
    colonyDomains = [...(multiSig.domainThresholds ?? [])];
  }

  const mutationResult = await updateExtension(multiSigAddress, {
    params: {
      multiSig: {
        colonyThreshold: globalThreshold.toNumber(),
        domainThresholds: colonyDomains,
      },
    },
  });

  const extensionHash = mutationResult?.updateColonyExtension?.extensionHash;
  const colonyAddress = mutationResult?.updateColonyExtension?.colonyAddress;

  if (!colonyAddress) {
    return;
  }

  const transaction = await provider.getTransaction(transactionHash);

  const installedBy =
    getTransactionSignerAddress(transaction) ?? constants.AddressZero;

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: installedBy,
    notificationType: NotificationType.ExtensionSettingsChanged,
    extensionHash,
  });
};
