import { Extension, getExtensionHash } from '@colony/colony-js';

import {
  setupListenersForVotingReputation,
  setupListenersForStakedExpenditure,
  setupListenersForStagedExpenditure,
  setupListenerForOneTxPayment,
} from '~eventListeners';
import { handleMultiSigInstalled } from '~eventListeners/extension/multiSig';
import { setupListenersForStreamingPayments } from '~eventListeners/extension/streamingPayments';
import networkClient from '~networkClient';
import { ContractEvent } from '@joincolony/blocks';
import { writeExtensionFromEvent } from '~utils';
import { updateExtensionCount } from '~utils/extensions';

export default async (event: ContractEvent): Promise<void> => {
  const { blockNumber } = event;
  const { extensionId: extensionHash, colony } = event.args;
  const extensionAddress = await networkClient.getExtensionInstallation(
    extensionHash,
    colony,
    { blockTag: blockNumber },
  );

  await writeExtensionFromEvent(event, extensionAddress);

  if (extensionHash === getExtensionHash(Extension.VotingReputation)) {
    setupListenersForVotingReputation(extensionAddress, colony, false);
  } else if (extensionHash === getExtensionHash(Extension.StakedExpenditure)) {
    setupListenersForStakedExpenditure(extensionAddress, colony, false);
  } else if (extensionHash === getExtensionHash(Extension.StagedExpenditure)) {
    setupListenersForStagedExpenditure(extensionAddress, colony);
  } else if (extensionHash === getExtensionHash(Extension.OneTxPayment)) {
    setupListenerForOneTxPayment(extensionAddress, colony);
  } else if (extensionHash === getExtensionHash(Extension.StreamingPayments)) {
    setupListenersForStreamingPayments(extensionAddress, colony);
  } else if (
    extensionHash === getExtensionHash(Extension.MultisigPermissions)
  ) {
    await handleMultiSigInstalled(extensionAddress, colony);
  }

  await updateExtensionCount(extensionHash);
};
