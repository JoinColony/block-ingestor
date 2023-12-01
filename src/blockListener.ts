import { output, getLastBlockNumber } from '~utils';
import { Block, EthersObserverEvents } from '~types';
import provider from '~provider';
import { processNextBlock } from '~blockProcessor';

/**
 * Map storing blocks that have been either picked up by the block listener
 * or missed blocks tracking
 * @TODO: Explore the possiblity of removing blocks once they've been processed
 */
export const blocksMap = new Map<number, Block>();

export const startBlockListener = (): void => {
  provider.on(EthersObserverEvents.Block, async (blockNumber: number) => {
    try {
      const block = await provider.getBlock(blockNumber);
      blocksMap.set(block.number, block);

      output(`Block ${blockNumber} added to the queue`);

      processNextBlock();
    } catch (error) {
      throw new Error(
        `Observed block ${blockNumber} but failed to get its data: ${error}`,
      );
    }
  });

  output('Block listener started');

  trackMissedBlocks();
};

/**
 * Function fetching all the blocks between the last processed block and the current block
 * that happened when ingestor was not actively listening
 */
const trackMissedBlocks = async (): Promise<void> => {
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

  for (let i = lastBlockNumber + 1; i <= currentBlockNumber; i += 1) {
    const block = await provider.getBlock(i);
    blocksMap.set(i, block);
  }

  processNextBlock();
};
