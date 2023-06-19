import { blocksMap } from '~blockListener';
import { getListenersLogTopics, getMatchingListener } from '~eventListeners';
import eventProcessor from '~eventProcessor';
import { getInterfaceByClientType } from '~interfaces';
import provider from '~provider';
import {
  getLastBlockNumber,
  mapLogToContractEvent,
  output,
  setLastBlockNumber,
} from '~utils';

let isProcessing = false;

export const processNextBlock = async (): Promise<void> => {
  if (isProcessing) {
    return;
  }

  // Only allow one instance of the function to run at any given time
  isProcessing = true;

  let lastBlockNumber = getLastBlockNumber();

  // Process as many blocks as are available sequentially
  while (blocksMap[lastBlockNumber + 1]) {
    const currentBlockNumber = lastBlockNumber + 1;
    output(`Processing block ${currentBlockNumber}`);

    const block = blocksMap[currentBlockNumber];
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
