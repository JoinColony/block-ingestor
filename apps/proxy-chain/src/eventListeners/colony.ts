import { ContractEventsSignatures } from '@joincolony/blocks';
import { addProxyColoniesNetworkEventListener } from './proxyColonies';
import {
  handleProxyColonyDeployed,
  handleTransfer,
} from '~handlers/proxyColonies';
import { getAllColoniesOnCurrentChain } from '~utils/getAllColoniesOnCurrentChain';
import { addTokenEventListener } from './token';

export const setupListenersForColonies = async (): Promise<void> => {
  addProxyColoniesNetworkEventListener(
    ContractEventsSignatures.ProxyColonyDeployed,
    handleProxyColonyDeployed,
  );

  const colonies = await getAllColoniesOnCurrentChain();
  colonies.forEach(({ colonyAddress }) => {
    setupListenersForColony(colonyAddress);
  });
};

export const setupListenersForColony = async (
  colonyAddress: string,
): Promise<void> => {
  console.log(`Setting up listeners for proxy colony ${colonyAddress}`);

  addTokenEventListener(
    ContractEventsSignatures.Transfer,
    handleTransfer,
    undefined,
    colonyAddress,
  );
};