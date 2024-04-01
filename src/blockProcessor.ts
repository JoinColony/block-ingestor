import { Log } from '@ethersproject/abstract-provider';
import { blocksMap, getLatestSeenBlockNumber } from '~blockListener';
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
import { BLOCK_PAGING_SIZE } from '~constants';

let isProcessing = false;
const blockLogs = new Map<number, Log[]>();
let timeNow = Date.now();
let timePrev = 0;

export const processNextBlock = async (): Promise<void> => {
  if (isProcessing) {
    return;
  }

  // Only allow one instance of the function to run at any given time
  isProcessing = true;

  let lastBlockNumber = getLastBlockNumber();

  // Process as many blocks as are available sequentially
  while (lastBlockNumber < getLatestSeenBlockNumber()) {
    const currentBlockNumber = lastBlockNumber + 1;
    if (currentBlockNumber % BLOCK_PAGING_SIZE === 0) {
      if (timePrev > 0) {
        timePrev = timeNow;
        timeNow = Date.now();
        output(
          `Time taken for last ${BLOCK_PAGING_SIZE} blocks: ${
            timeNow - timePrev
          }ms`,
        );
        output(
          `Estimated time to sync: ${
            ((timeNow - timePrev) *
              (getLatestSeenBlockNumber() - getLastBlockNumber())) /
            1000
          }ms`,
        );
        output(
          `Overall progress: ${currentBlockNumber} / ${getLatestSeenBlockNumber()}`,
        );
      } else {
        timePrev = timeNow;
      }
    }

    if (!blockLogs.get(currentBlockNumber)) {
      // BLOCK_PAGING_SIZE - 1 thanks to fenceposts
      const nMoreBlocks = Math.min(
        getLatestSeenBlockNumber() - currentBlockNumber,
        BLOCK_PAGING_SIZE - 1,
      );
      const logs = await provider.getLogs({
        fromBlock: currentBlockNumber,
        toBlock: currentBlockNumber + nMoreBlocks,
      });

      for (
        let i = currentBlockNumber;
        i <= currentBlockNumber + nMoreBlocks;
        i++
      ) {
        blockLogs.set(i, []);
      }

      let logIndex = 0;
      let pushingBlock = 0;
      let pushingLogs: Log[] = [];

      logs.forEach((log) => {
        // As we push logs in to blockLogs, check they're in order
        // (They should be...)
        if (log.blockNumber !== pushingBlock) {
          if (pushingBlock > log.blockNumber) {
            output(
              `Blocks (that logs from query are in) are not monotonically increasing`,
            );
            process.exit(1);
          }
          pushingBlock = log.blockNumber;
          blockLogs.set(pushingBlock, [...pushingLogs]);
          pushingLogs = [];
          logIndex = 0;
        }
        if (log.logIndex !== logIndex) {
          output(`Logs are out of order for block ${log.blockNumber}`);
          process.exit(1);
        }
        pushingLogs.push(log);
        logIndex += 1;
      });
      // Push the logs in the last block
      blockLogs.set(pushingBlock, [...pushingLogs]);
    }

    // Get logs contained in the current block
    const logs = blockLogs.get(currentBlockNumber);
    if (!logs) {
      throw new Error(
        `Could not find logs for block ${currentBlockNumber}, but should have been fetched`,
      );
    }

    for (const log of logs) {
      // For each log, try to find a matching listener to establish if we should handle or dismiss it
      const listener = getMatchingListener(log.topics, log.address);
      if (!listener) {
        continue;
      }

      // In order to parse the log, we need an ethers interface
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
    blockLogs.delete(currentBlockNumber);
    blocksMap.delete(currentBlockNumber);
  }

  isProcessing = false;
};
