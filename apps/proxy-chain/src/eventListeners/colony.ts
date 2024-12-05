import { ContractEventsSignatures } from '@joincolony/blocks';
import { addProxyColoniesEventListener } from './proxyColonies';
import { handleProxyColonyDeployed } from '~handlers/proxyColonies';
import { handleWormholeMessageReceived } from '~handlers/network';

export const setupListenersForColonies = async (): Promise<void> => {
  addProxyColoniesEventListener(
    ContractEventsSignatures.WormholeMessageReceived,
    handleWormholeMessageReceived,
  );

  addProxyColoniesEventListener(
    ContractEventsSignatures.ProxyColonyDeployed,
    handleProxyColonyDeployed,
  );
};
