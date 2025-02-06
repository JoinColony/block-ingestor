import {
  CreateProxyColonyDocument,
  CreateProxyColonyMutation,
  CreateProxyColonyMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import amplifyClient from '~amplifyClient';
import rpcProvider from '~provider';
import { output } from '@joincolony/utils';
import multiChainBridgeClient from '~multiChainBridgeClient';
import { setupListenersForColony } from '~eventListeners';
import {
  getBridgedTxDetails,
  getWormholeEventForBlockNumber,
  syncMultiChainInfo,
} from '~utils/crossChain';

export const handleProxyColonyDeployed = async (
  event: ContractEvent,
): Promise<void> => {
  const {
    blockNumber,
    args: { proxyColony: proxyColonyAddress },
  } = event;

  if (!proxyColonyAddress) {
    output('No proxyColony emitted!');
    return;
  }

  const wormholeEvent = await getWormholeEventForBlockNumber(blockNumber);

  if (!wormholeEvent) {
    output(
      `The WormholeMessageReceived event is not present in the same block`,
    );

    return;
  }

  console.log(
    `Mapped wormhole chain id`,
    multiChainBridgeClient.getWormholeChainId(rpcProvider.getChainId()),
  );

  const chainId = rpcProvider.getChainId();
  const { sourceChainTxHash, isDeploymentCompleted } =
    await getBridgedTxDetails(wormholeEvent);

  if (!sourceChainTxHash) {
    output(`Missing source chain txHash`);
    return;
  }

  // if this event was fired we NEED to save it in the database, even if the action doesn't exist
  await amplifyClient.mutate<
    CreateProxyColonyMutation,
    CreateProxyColonyMutationVariables
  >(CreateProxyColonyDocument, {
    input: {
      id: `${proxyColonyAddress}_${chainId}`,
      colonyAddress: proxyColonyAddress,
      chainId,
      isActive: true,
    },
  });

  await syncMultiChainInfo(
    wormholeEvent,
    sourceChainTxHash,
    Number(chainId),
    isDeploymentCompleted,
  );

  setupListenersForColony(proxyColonyAddress);
};
