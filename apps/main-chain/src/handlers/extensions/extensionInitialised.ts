import { Extension, getExtensionHash } from '@colony/colony-js';

import { ContractEvent } from '~types';
import { verbose, addVotingReputationParamsToDB } from '~utils';
import {
  setupListenersForStakedExpenditure,
  setupMotionsListeners,
} from '~eventListeners';
import { sendExtensionUpdateNotifications } from '~utils/notifications';
import { constants } from 'ethers';
import { updateExtension } from '~utils/extensions/updateExtension';
import { NotificationType } from '@joincolony/graphql';
import provider from '~provider';
import { getTransactionSignerAddress } from '~utils/transactions';

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

  const transaction = await provider.getTransaction(transactionHash);

  const initialisedBy =
    getTransactionSignerAddress(transaction) ?? constants.AddressZero;

  sendExtensionUpdateNotifications({
    colonyAddress,
    creator: initialisedBy,
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
