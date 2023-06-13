import { output, mapLogToContractEvent } from '~utils';
import { Block, EthersObserverEvents } from '~types';
import provider from '~provider';
import { getListenersLogTopics, getMatchingListener } from '~eventListeners';
import eventProcessor from '~eventProcessor';
import { getInterfaceByClientType } from '~interfaces';

const blocks: Record<number, Block | undefined> = {};
let latestBlockNumber: number | null = null;

export const startBlockListener = (): void => {
  provider.on(EthersObserverEvents.Block, async (blockNumber: number) => {
    try {
      const block = await provider.getBlock(blockNumber);
      blocks[block.number] = block;

      // @NOTE: Temp
      if (!latestBlockNumber) {
        latestBlockNumber = block.number - 1;
      }

      output(`Block ${blockNumber} added to the queue`);
      processNextBlock();
    } catch {
      output(`Observed block ${blockNumber} but failed to get its data`);
    }
  });
  output('Block listener started');
};

let isProcessing = false;
const processNextBlock = async (): Promise<void> => {
  if (isProcessing) {
    return;
  }

  // @NOTE: Temp
  if (!latestBlockNumber) {
    return;
  }

  // Only allow one instance of the function to run at any given time
  isProcessing = true;

  // Process as many blocks as are available sequentially
  while (blocks[latestBlockNumber + 1]) {
    const currentBlockNumber = latestBlockNumber + 1;
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

    latestBlockNumber += 1;
  }

  isProcessing = false;
};
