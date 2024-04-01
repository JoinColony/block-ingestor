import { output, getLastBlockNumber } from '~utils';
import { Block, EthersObserverEvents } from '~types';
import provider from '~provider';
import { processNextBlock } from '~blockProcessor';

/**
 * Map storing blocks that have been either picked up by the block listener
 * or missed blocks tracking
 * Blocks are removed once processed by a call to .delete in the blockProcessor
 */
export const blocksMap = new Map<number, Block>();
let latestSeenBlockNumber = 0;

export const getLatestSeenBlockNumber = (): number => latestSeenBlockNumber;
// export const blocksMap = new Map<number, boolean|Block>();

export const startBlockListener = (): void => {
  provider.on(EthersObserverEvents.Block, async (blockNumber: number) => {
    try {
      // For now, we just track that this block exists.
      latestSeenBlockNumber = Math.max(latestSeenBlockNumber, blockNumber);

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
    `Will need to process blocks from block ${
      lastBlockNumber + 1
    } to ${currentBlockNumber}`,
  );

  latestSeenBlockNumber = Math.max(latestSeenBlockNumber, currentBlockNumber);

  processNextBlock();
};
