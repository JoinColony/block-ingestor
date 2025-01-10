import { ContractEventsSignatures } from '@joincolony/blocks';
import { addProxyColoniesNetworkEventListener } from './proxyColonies';
import { handleProxyColonyDeployed } from '~handlers/proxyColonies';

export const setupListenersForColonies = async (): Promise<void> => {
  addProxyColoniesNetworkEventListener(
    ContractEventsSignatures.ProxyColonyDeployed,
    handleProxyColonyDeployed,
  );
};
