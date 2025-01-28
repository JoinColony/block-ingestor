import {
  CreateProxyColonyDocument,
  CreateProxyColonyMutation,
  CreateProxyColonyMutationVariables,
  GetActionInfoDocument,
  GetActionInfoQuery,
  GetActionInfoQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
} from '@joincolony/graphql';
import {
  ContractEvent,
  ContractEventsSignatures,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import amplifyClient from '~amplifyClient';
import rpcProvider from '~provider';
import { output } from '@joincolony/utils';
import { utils } from 'ethers';
import blockManager from '~blockManager';
import multiChainBridgeClient from '~multiChainBridgeClient';
import { setupListenersForColony } from '~eventListeners';

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
    logs.map((log) =>
      blockManager.mapLogToContractEvent(log, ProxyColonyEvents),
    ),
  );

  const wormholeEvent = events.find(
    (event) =>
      ContractEventsSignatures.WormholeMessageReceived === event?.signature,
  );
  const proxyDeployedEvent = events.find(
    (event) =>
      ContractEventsSignatures.ProxyColonyDeployed === event?.signature,
  );

  if (!wormholeEvent || !proxyDeployedEvent) {
    output(
      `ProxyColonyDeployed or WormholeMessageReceived are not present in the same block`,
    );

    return;
  }

  console.log(`RPC provider chain id`, rpcProvider.getChainId());
  console.log(
    `Mapped wormhole chain id`,
    multiChainBridgeClient.getWormholeChainId(rpcProvider.getChainId()),
  );

  const { emitterChainId, emitterAddress, sequence } = wormholeEvent.args;
  const chainId = rpcProvider.getChainId();
  let sourceChainTxHash;
  let isDeploymentCompleted = false;

  try {
    const multiChainBridgeOperationsData =
      await multiChainBridgeClient.fetchOperationDetails({
        emitterAddress,
        emitterChainId,
        sequence,
      });

    sourceChainTxHash =
      multiChainBridgeOperationsData?.sourceChain?.transaction?.txHash;
    const sourceChainOperationStatus =
      multiChainBridgeOperationsData?.sourceChain?.status;
    isDeploymentCompleted =
      sourceChainOperationStatus ===
      multiChainBridgeClient.REQ_STATUS.CONFIRMED;
  } catch (error) {
    output(
      `Error while fetching multi-chain bridge operations details: ${
        (error as Error).message
      }.`,
    );
  }

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

  const actionResponse = await amplifyClient.query<
    GetActionInfoQuery,
    GetActionInfoQueryVariables
  >(GetActionInfoDocument, { transactionHash: sourceChainTxHash });
  const actionData = actionResponse?.data?.getColonyAction;

  if (!actionData) {
    output(
      `The txHash: ${sourceChainTxHash} is not an action on the main chain.`,
    );
    return;
  }

  if (!actionData.multiChainInfo) {
    output(`The action: ${sourceChainTxHash} doesn't have multi chain data.`);
    return;
  }

  await amplifyClient.mutate<
    UpdateColonyActionMutation,
    UpdateColonyActionMutationVariables
  >(UpdateColonyActionDocument, {
    input: {
      id: sourceChainTxHash,
      multiChainInfo: {
        ...actionData.multiChainInfo,
        completed: isDeploymentCompleted,
        wormholeInfo: {
          emitterAddress: emitterAddress.toString(),
          emitterChainId,
          sequence: sequence.toString(),
        },
      },
    },
  });

  setupListenersForColony(proxyColonyAddress);
};
