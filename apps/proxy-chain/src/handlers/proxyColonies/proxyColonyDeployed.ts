import {
  CreateProxyColonyDocument,
  CreateProxyColonyMutation,
  CreateProxyColonyMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent, ContractEventsSignatures, ProxyColonyEvents } from '@joincolony/blocks';
import amplifyClient from '~amplifyClient';
import rpcProvider from '~provider';
import { output } from '@joincolony/utils';
import { utils } from 'ethers';
import blockManager from '~blockManager';
import multiChainBridgeClient from '~multiChainBridgeClient';

export const handleProxyColonyDeployed = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('proxy colony deployed event', event);
  const { blockNumber, args: { proxyColony: proxyColonyAddress } } = event;

  const logs = await rpcProvider.getProviderInstance().getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [
      [
        utils.id(ContractEventsSignatures.ProxyColonyDeployed),
        utils.id(ContractEventsSignatures.WormholeMessageReceived),
      ],
    ],
  });

  const events = await Promise.all(
    logs.map((log) => blockManager.mapLogToContractEvent(
      log,
      ProxyColonyEvents,
    )),
  );

  const wormholeEvent = events.find(event => ContractEventsSignatures.WormholeMessageReceived === event?.signature);
  const proxyDeployedEvent = events.find(event => ContractEventsSignatures.ProxyColonyDeployed === event?.signature);

  if (!wormholeEvent || !proxyDeployedEvent) {
    output(`ProxyColonyDeployed or WormholeMessageReceived are not present in the same block`);

    return;
  }

  console.log(wormholeEvent, proxyDeployedEvent);

  console.log(`RPC provider chain id`, rpcProvider.getChainId());
  console.log(`Mapped wormhole chain id`, multiChainBridgeClient.getWormholeChainId(rpcProvider.getChainId()));

  const { emitterChainId, emitterAddress, sequence } = wormholeEvent.args;

  const multiChainBridgeOperationsResponse = await multiChainBridgeClient.fetchOperationDetails({
    emitterAddress,
    emitterChainId,
    sequence,
  });

  const multiChainBridgeOperationsData = await multiChainBridgeOperationsResponse.json();
  const multiChainTxHash = multiChainBridgeOperationsData?.sourceChain?.transaction?.txHash;

  console.log(`The action tx hash`, multiChainTxHash)

  // get the transaction hash from the response.data.sourceChain
  // get the action based on txHash
  // set pending to false

  if (!proxyColonyAddress) {
    output('No proxyColony emitted!');
    return;
  }

  const chainId = rpcProvider.getChainId();

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
};
