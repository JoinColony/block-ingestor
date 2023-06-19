import {
  output,
  mapLogToContractEvent,
  getLastBlockNumber,
  setLastBlockNumber,
} from '~utils';
import { Block, EthersObserverEvents } from '~types';
import provider from '~provider';
import { getListenersLogTopics, getMatchingListener } from '~eventListeners';
import eventProcessor from '~eventProcessor';
import { getInterfaceByClientType } from '~interfaces';

export const blocks: Record<number, Block | undefined> = {};

export const startBlockListener = (): void => {
  provider.on(EthersObserverEvents.Block, async (blockNumber: number) => {
    try {
      const block = await provider.getBlock(blockNumber);
      blocks[block.number] = block;

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

  output(
    `Fetching blocks from block ${
      lastBlockNumber + 1
    } to ${currentBlockNumber}`,
  );

  for (let i = lastBlockNumber; i < currentBlockNumber; i += 1) {
    const block = await provider.getBlock(i);
    blocks[i] = block;
  }

  processNextBlock();
};

let isProcessing = false;
const processNextBlock = async (): Promise<void> => {
  if (isProcessing) {
    return;
  }

  // Only allow one instance of the function to run at any given time
  isProcessing = true;

  let lastBlockNumber = getLastBlockNumber();

  // Process as many blocks as are available sequentially
  while (blocks[lastBlockNumber + 1]) {
    const currentBlockNumber = lastBlockNumber + 1;
    output(`Processing block ${currentBlockNumber}`);

    const block = blocks[currentBlockNumber];
    if (!block) {
      return;
    }

    const logs = await provider.getLogs({
      fromBlock: block.number,
      toBlock: block.number,
      topics: getListenersLogTopics(),
    });

    for (const log of logs) {
      const listener = getMatchingListener(log.topics, log.address);
      if (!listener) {
        continue;
      }

      const iface = getInterfaceByClientType(listener.clientType);
      if (!iface) {
        output(
          `Failed to get an interface for a log with client type ${listener.clientType}`,
        );
        continue;
      }

      const event = await mapLogToContractEvent(log, iface);
      if (!event) {
        output(
          `Failed to map log ${log.logIndex} from transaction ${log.transactionHash}`,
        );
        continue;
      }

      // Call the processor in a blocking way to ensure events get processed sequentially
      await eventProcessor(event);
    }

    lastBlockNumber = currentBlockNumber;
    setLastBlockNumber(currentBlockNumber);
  }

  isProcessing = false;
};
