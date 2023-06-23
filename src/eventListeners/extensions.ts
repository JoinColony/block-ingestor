import { ContractEventsSignatures } from '~types';

import { addNetworkEventListener } from './network';
import { setupListenersForVotingReputationExtensions } from './votingReputation';

export const setupListenersForExtensions = async (): Promise<void> => {
  const extensionEvents = [
    ContractEventsSignatures.ExtensionInstalled,
    ContractEventsSignatures.ExtensionUninstalled,
    ContractEventsSignatures.ExtensionDeprecated,
    ContractEventsSignatures.ExtensionUpgraded,
  ];

  extensionEvents.forEach((eventSignature) =>
    addNetworkEventListener(eventSignature),
  );

  setupListenersForVotingReputationExtensions();
};
