import {
  ContractEvent,
  ContractEventsSignatures,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import {
  CreateMultiChainInfoInput,
  UpdateMultiChainInfoInput,
} from '@joincolony/graphql';
import {
  getMultiChainInfoId,
  output,
  upsertMultiChainInfo,
} from '@joincolony/utils';
import { utils } from 'ethers';
import amplifyClient from '~amplifyClient';
import blockManager from '~blockManager';
import multiChainBridgeClient from '~multiChainBridgeClient';
import rpcProvider from '~provider';

export const getWormholeEventForBlockNumber = async (
  blockNumber: number,
): Promise<ContractEvent | undefined> => {
  const logs = await rpcProvider.getProviderInstance().getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [[utils.id(ContractEventsSignatures.WormholeMessageReceived)]],
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

  return wormholeEvent ?? undefined;
};

interface GetBridgedTxDetailsResult {
  isDeploymentCompleted: boolean;
  sourceChainTxHash: string | undefined;
}

export const getBridgedTxDetails = async (
  wormholeEvent: ContractEvent,
): Promise<GetBridgedTxDetailsResult> => {
  const { emitterChainId, emitterAddress, sequence } = wormholeEvent.args;
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

  return { isDeploymentCompleted, sourceChainTxHash };
};

export const syncMultiChainInfo = async (
  wormholeEvent: ContractEvent,
  txHash: string,
  chainId: number,
  isCompleted: boolean,
): Promise<void> => {
  const { emitterChainId, emitterAddress, sequence } = wormholeEvent.args;

  // we could technically use this one, but we should use the one of the created one, just so we have all the core logic in the upsertMultiChainInfo helper
  const existingMultiChainInfoId = getMultiChainInfoId(txHash, chainId);

  const createMultiChainInfoInput: CreateMultiChainInfoInput = {
    id: existingMultiChainInfoId,
    completedOnMainChain: false,
    completedOnProxyChain: isCompleted,
    wormholeInfo: {
      emitterAddress: emitterAddress.toString(),
      emitterChainId,
      sequence: sequence.toString(),
    },
  };

  const updateMultiChainInfoInput: UpdateMultiChainInfoInput = {
    id: existingMultiChainInfoId,
    completedOnProxyChain: isCompleted,
    wormholeInfo: {
      emitterAddress: emitterAddress.toString(),
      emitterChainId,
      sequence: sequence.toString(),
    },
  };

  await upsertMultiChainInfo(
    amplifyClient,
    existingMultiChainInfoId,
    createMultiChainInfoInput,
    updateMultiChainInfoInput,
  );
};
