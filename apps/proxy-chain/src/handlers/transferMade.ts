import { ContractEvent } from '@joincolony/blocks';
import { output } from '@joincolony/utils';
import rpcProvider from '~provider';
import {
  getBridgedTxDetails,
  getWormholeEventForBlockNumber,
  syncMultiChainInfo,
} from '~utils/crossChain';

export const handleTransferMade = async (
  event: ContractEvent,
): Promise<void> => {
  const { blockNumber } = event;

  const wormholeEvent = await getWormholeEventForBlockNumber(blockNumber);

  if (!wormholeEvent) {
    output(
      `The WormholeMessageReceived event is not present in the same block`,
    );

    return;
  }

  const chainId = rpcProvider.getChainId();
  const { sourceChainTxHash, isDeploymentCompleted } =
    await getBridgedTxDetails(wormholeEvent);

  if (!sourceChainTxHash) {
    output(`Missing source chain txHash`);
    return;
  }

  await syncMultiChainInfo(
    wormholeEvent,
    sourceChainTxHash,
    Number(chainId),
    isDeploymentCompleted,
  );
};
