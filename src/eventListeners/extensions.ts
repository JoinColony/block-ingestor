import { addNetworkEventListener } from './network';
import { ContractEventsSignatures } from '~types';

export const setupListenersForExtensions = (): void => {
  addNetworkEventListener(ContractEventsSignatures.ExtensionInstalled);
  addNetworkEventListener(ContractEventsSignatures.ExtensionUninstalled);
  addNetworkEventListener(ContractEventsSignatures.ExtensionDeprecated);
  addNetworkEventListener(ContractEventsSignatures.ExtensionUpgraded);
};
