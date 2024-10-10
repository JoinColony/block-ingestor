import { constants } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetColonyExtensionByAddressDocument,
  GetColonyExtensionByAddressQuery,
  GetColonyExtensionByAddressQueryVariables,
} from '~graphql';
import networkClient from '~networkClient';
import { EventHandler } from '~types';
import { updateExtension } from '~utils/extensions/updateExtension';
import {
  NotificationType,
  sendExtensionUpdateNotifications,
} from '~utils/notifications';

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

  const receipt = await networkClient.provider.getTransactionReceipt(
    transactionHash,
  );

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: receipt.from || constants.AddressZero,
    notificationType: NotificationType.ExtensionSettingsChanged,
    extensionHash,
  });
};
