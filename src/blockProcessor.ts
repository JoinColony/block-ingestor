import { blocksMap } from '~blockListener';
import {
  getAdditionalContractEventProperties,
  getMatchingListener,
} from '~eventListeners';
import eventProcessor from '~eventProcessor';
import { getInterfaceByListener } from '~interfaces';
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
  while (blocksMap.get(lastBlockNumber + 1)) {
    const currentBlockNumber = lastBlockNumber + 1;
    output(`Processing block ${currentBlockNumber}`);

    const block = blocksMap.get(currentBlockNumber);
    if (!block) {
      output(`Could not find block ${currentBlockNumber} in the queue.`);
      break;
    }

    // Get logs contained in the current block
    const logs = await provider.getLogs({
      fromBlock: block.number,
      toBlock: block.number,
    });

    for (const log of logs) {
      // For each log, try to find a matching listener to establish if we should handle or dismiss it
      const listener = getMatchingListener(log.topics, log.address);
      if (!listener) {
        continue;
      }

      // In order to parse the log, we need an ether's interface
      const iface = getInterfaceByListener(listener);
      if (!iface) {
        output(
          `Failed to get an interface for a log with listener type ${listener.type}`,
        );
        continue;
      }

      // Depending on the listener type, we might want to "attach" some additional properties to the mapped event
      const additionalProperties =
        getAdditionalContractEventProperties(listener);
      const event = await mapLogToContractEvent(
        log,
        iface,
        additionalProperties,
      );
      if (!event) {
        output(
          `Failed to map log describing event ${listener.eventSignature} in transaction ${log.transactionHash} `,
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
