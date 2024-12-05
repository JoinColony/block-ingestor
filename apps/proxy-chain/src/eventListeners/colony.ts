import { ContractEventsSignatures } from '@joincolony/blocks';
import { addProxyColoniesEventListener } from './proxyColonies';
import { handleProxyColonyDeployed } from '~handlers/proxyColonies';

export const setupListenersForColonies = async (): Promise<void> => {
  addProxyColoniesEventListener(
    ContractEventsSignatures.ProxyColonyDeployed,
    handleProxyColonyDeployed,
  );
};
