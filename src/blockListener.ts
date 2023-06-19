import { output, getLastBlockNumber } from '~utils';
import { Block, EthersObserverEvents } from '~types';
import provider from '~provider';
import { processNextBlock } from '~blockProcessor';

/**
 * Object storing blocks that have been either picked up by the block listener
 * or missed blocks tracking
 * The ability to index on block number made it much easier to ensure sequential
 * processing of the blocks
 */
export const blocksMap: Record<number, Block | undefined> = {};

export const startBlockListener = (): void => {
  provider.on(EthersObserverEvents.Block, async (blockNumber: number) => {
    try {
      const block = await provider.getBlock(blockNumber);
      blocksMap[block.number] = block;

      output(`Block ${blockNumber} added to the queue`);
      processNextBlock();
    } catch {
      output(`Observed block ${blockNumber} but failed to get its data`);
    }
  });

  output('Block listener started');

  trackMissedBlocks();
};

export const trackMissedBlocks = async (): Promise<void> => {
  const lastBlockNumber = getLastBlockNumber();
  const currentBlockNumber = await provider.getBlockNumber();

  if (lastBlockNumber >= currentBlockNumber) {
    return;
  }

  output(
    `Fetching blocks from block ${
      lastBlockNumber + 1
    } to ${currentBlockNumber}`,
  );

  for (let i = lastBlockNumber; i < currentBlockNumber; i += 1) {
    const block = await provider.getBlock(i);
    blocksMap[i] = block;
  }

  processNextBlock();
};
