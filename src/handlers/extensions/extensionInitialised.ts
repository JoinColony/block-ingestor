import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEvent } from '~types';
import { verbose, addVotingReputationParamsToDB } from '~utils';
import {
  setupListenersForStakedExpenditure,
  setupMotionsListeners,
} from '~eventListeners';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
import networkClient from '~networkClient';
import { constants } from 'ethers';
import { updateExtension } from '~utils/extensions/updateExtension';
import { NotificationType } from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress, transactionHash } = event;

  verbose('Extension with address:', extensionAddress, 'was enabled');

  const mutationResult = await updateExtension(extensionAddress, {
    isInitialized: true,
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
    notificationType: NotificationType.ExtensionEnabled,
    extensionHash,
  });

  if (getExtensionHash(Extension.VotingReputation) === extensionHash) {
    /* Listen for motions once Voting Reputation is enabled. */
    setupMotionsListeners(extensionAddress, colonyAddress);
    await addVotingReputationParamsToDB(extensionAddress, colonyAddress);
  } else if (getExtensionHash(Extension.StakedExpenditure) === extensionHash) {
    setupListenersForStakedExpenditure(extensionAddress, colonyAddress, true);
  }
};
