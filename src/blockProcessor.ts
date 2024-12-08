import { Log } from '@ethersproject/abstract-provider';
import { blocksMap, getLatestSeenBlockNumber } from '~blockListener';
import { getMatchingListeners } from '~eventListeners';
import { getInterfaceByListener } from '~interfaces';
import provider from '~provider';
import {
  getLastBlockNumber,
  mapLogToContractEvent,
  output,
  verbose,
  setLastBlockNumber,
} from '~utils';
import { BLOCK_PAGING_SIZE } from '~constants';
import { ContractEvent, ContractEventsSignatures } from '~types';
import { handleMintTokensAction } from '~actions/actionHandlers';
import { isEqual } from 'lodash';
import { ActionMatcher } from '~actions/types';

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

      verbose(
        'Querying for logs',
        currentBlockNumber,
        'to',
        currentBlockNumber + nMoreBlocks,
      );

      const logs = await provider.getLogs({
        fromBlock: currentBlockNumber,
        toBlock: currentBlockNumber + nMoreBlocks,
      });

      verbose(
        `Fetched ${logs.length} logs`,
        currentBlockNumber,
        'to',
        currentBlockNumber + nMoreBlocks,
      );

      // initialize blockLogs
      for (
        let i = currentBlockNumber;
        i <= currentBlockNumber + nMoreBlocks;
        i += 1
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
          blockLogs.set(pushingBlock, [...pushingLogs]);
          pushingBlock = log.blockNumber;
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

    /*
     * Logic needed to account for blocks that get emmited, but which don't have the logs indexed yet
     * This happens in networks with very fast block times, like arbitrum (<=250ms block times)
     * See: https://github.com/ethers-io/ethers.js/issues/3486
     *
     * Basically, the change that @area implemented here is to try and detect if a block actually has
     * logs, but which don't get retrived using the `getLogs` call.
     * If that happens, it means the block was emitted, but the logs weren't indexed yet, at which point
     * we just short-circuit and re-process the block.
     * We do this enough times, until the logs are actually indexed.
     */
    if (logs.length === 0) {
      verbose('No logs seen in block', currentBlockNumber);
      // Check whether block actually has no logs
      let block = blocksMap.get(currentBlockNumber);
      if (
        !block ||
        (block.transactions as string[]).every((tx) => typeof tx === 'string')
      ) {
        block = await provider.getBlockWithTransactions(currentBlockNumber);
        // May as well save this block in the blocksMap in case it turns out we need it in mapLogToContractEvent
        blocksMap.set(currentBlockNumber, block);
      }

      let mustReindex = false;
      for (const tx of block.transactions) {
        if (typeof tx === 'string') {
          throw Error('tx was a string, but should have been a TxResponse');
        }
        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        if (txReceipt.logs.length > 0) {
          verbose(
            `Proved ${currentBlockNumber} has logs, but weren't given any, will reindex`,
          );
          mustReindex = true;
          // Then the block has events, and they've not been indexed yet.
          // We exit out of this handler, and wait until they've been indexed.
          // We remove the empty array from blockLogs to cause the getLogs call to be made again
          blockLogs.delete(currentBlockNumber);
          // Now we've proved we're missing events, don't need to look at any other transactions in
          // this block.
          break;
        }
      }
      if (mustReindex) {
        continue;
      }
    }

    const blockEvents = [];

    for (const log of logs) {
      // Find listeners that match the log
      const listeners = getMatchingListeners(log.topics, log.address);
      if (!listeners.length) {
        continue;
      }

      for (const listener of listeners) {
        // In order to parse the log, we need an ethers interface
        const iface = getInterfaceByListener(listener);
        if (!iface) {
          output(
            `Failed to get an interface for a log with listener type ${listener.type}`,
          );
          continue;
        }

        const event = await mapLogToContractEvent(log, iface);
        if (!event) {
          output(
            `Failed to map log describing event ${listener.eventSignature} in transaction ${log.transactionHash} `,
          );
          continue;
        }

        blockEvents.push(event);

        // Call the handler in a blocking way to ensure events get processed sequentially
        await listener.handler?.(event, listener);
      }
    }

    console.log({ blockEvents });

    interface ActionMatch {
      events: ContractEvent[];
      matcher: ActionMatcher;
    }

    const actionMatchers = [
      {
        eventSignatures: [ContractEventsSignatures.TokensMinted],
        handler: handleMintTokensAction,
      },
      {
        eventSignatures: [
          ContractEventsSignatures.ExpenditurePayoutClaimed,
          ContractEventsSignatures.OneTxPaymentMade,
        ],
        handler: async () => {
          console.log('\n\n\nSIMPLE PAYMENT\n\n');
        },
      },
    ];

    const matches: ActionMatch[] = [];

    let startIndex = 0;
    let endIndex = blockEvents.length;

    while (startIndex < blockEvents.length) {
      const potentialMatch = blockEvents.slice(startIndex, endIndex);

      console.log({
        potentialMatch: potentialMatch.map((event) => event.signature),
      });

      let matchFound = false;
      for (const actionMatcher of actionMatchers) {
        if (
          isEqual(
            actionMatcher.eventSignatures,
            potentialMatch.map((event) => event.signature),
          )
        ) {
          matches.push({
            events: potentialMatch,
            matcher: actionMatcher,
          });
          // Move startIndex past the matched events
          startIndex += potentialMatch.length;
          endIndex = blockEvents.length;
          matchFound = true;
          break; // Exit the actionMatcher loop since we found a match
        }
      }

      // If no match was found, adjust the window
      if (!matchFound) {
        if (endIndex > startIndex + 1) {
          endIndex--;
        } else {
          startIndex++;
          endIndex = blockEvents.length;
        }
      }
    }

    console.log({ matches });

    // process the matches
    for (const match of matches) {
      await match.matcher.handler(match.events);
    }

    verbose('processed block', currentBlockNumber);

    lastBlockNumber = currentBlockNumber;
    setLastBlockNumber(currentBlockNumber);
    blockLogs.delete(currentBlockNumber);
    blocksMap.delete(currentBlockNumber);
  }

  isProcessing = false;
};
