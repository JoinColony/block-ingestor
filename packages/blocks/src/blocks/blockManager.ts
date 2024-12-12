import { Log } from '@ethersproject/abstract-provider';
import { output, verbose } from '@joincolony/utils';
import { EventManager, ContractEvent, EthersObserverEvents } from '../events';
import {
  Block,
  BlockWithTransactions,
} from './types';
import { RpcProvider } from '@joincolony/clients';
import { utils } from 'ethers';
import { StatsManager } from '../stats/statsManager';

export const BLOCK_PAGING_SIZE = process.env.BLOCK_PAGING_SIZE
  ? parseInt(process.env.BLOCK_PAGING_SIZE, 10)
  : 1000;

export class BlockManager {
  private readonly blocksMap = new Map<number, Block | BlockWithTransactions>();
  private readonly blockLogs = new Map<number, Log[]>();
  private latestSeenBlockNumber = 0;
  private isProcessing = false;
  private readonly eventManager: EventManager;
  private readonly rpcProvider: RpcProvider;
  private readonly statsManager: StatsManager;
  private timeNow = Date.now();
  private timePrev = 0;

  constructor(
    eventManager: EventManager,
    rpcProvider: RpcProvider,
    statsManager: StatsManager,
  ) {
    this.eventManager = eventManager;
    this.rpcProvider = rpcProvider;
    this.statsManager = statsManager;
  }

  public getBlock(blockNumber: number): Block | BlockWithTransactions {
    return this.blocksMap.get(blockNumber);
  }

  public updateBlocksMap(
    blockNumber: number,
    block: Block | BlockWithTransactions,
  ): void {
    this.blocksMap.set(blockNumber, block);
  }

  public getLatestSeenBlockNumber(): number {
    return this.latestSeenBlockNumber;
  }

  public startBlockListener(): void {
    this.rpcProvider
      .getProviderInstance()
      .on(EthersObserverEvents.Block, async (blockNumber: number) => {
        try {
          this.latestSeenBlockNumber = Math.max(
            this.latestSeenBlockNumber,
            blockNumber,
          );
          output(`Block ${blockNumber} added to the queue`);
          await this.processNextBlock();
        } catch (error) {
          throw new Error(
            `Observed block ${blockNumber} but failed to get its data: ${error}`,
          );
        }
      });

    output('Block listener started');
    this.trackMissedBlocks();
  }

  private async trackMissedBlocks(): Promise<void> {
    const lastBlockNumber = this.statsManager.getLastBlockNumber();
    const currentBlockNumber = await this.rpcProvider
      .getProviderInstance()
      .getBlockNumber();

    if (lastBlockNumber >= currentBlockNumber) return;

    output(
      `Processing blocks from ${lastBlockNumber + 1} to ${currentBlockNumber}`,
    );
    this.latestSeenBlockNumber = Math.max(
      this.latestSeenBlockNumber,
      currentBlockNumber,
    );
    await this.processNextBlock();
  }

  private async processNextBlock(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    // Only allow one instance of the function to run at any given time
    this.isProcessing = true;

    let lastBlockNumber = this.statsManager.getLastBlockNumber();

    // Process as many blocks as are available sequentially
    while (lastBlockNumber < this.getLatestSeenBlockNumber()) {
      const currentBlockNumber = lastBlockNumber + 1;
      if (currentBlockNumber % BLOCK_PAGING_SIZE === 0) {
        if (this.timePrev > 0) {
          this.timePrev = this.timeNow;
          this.timeNow = Date.now();
          output(
            `Time taken for last ${BLOCK_PAGING_SIZE} blocks: ${
              this.timeNow - this.timePrev
            }ms`,
          );
          output(
            `Estimated time to sync: ${
              ((this.timeNow - this.timePrev) *
                (this.getLatestSeenBlockNumber() -
                  this.statsManager.getLastBlockNumber())) /
              1000
            }ms`,
          );
          output(
            `Overall progress: ${currentBlockNumber} / ${this.getLatestSeenBlockNumber()}`,
          );
        } else {
          this.timePrev = this.timeNow;
        }
      }

      if (!this.blockLogs.get(currentBlockNumber)) {
        // BLOCK_PAGING_SIZE - 1 thanks to fenceposts
        const nMoreBlocks = Math.min(
          this.getLatestSeenBlockNumber() - currentBlockNumber,
          BLOCK_PAGING_SIZE - 1,
        );

        verbose(
          'Querying for logs',
          currentBlockNumber,
          'to',
          currentBlockNumber + nMoreBlocks,
        );

        const logs = await this.rpcProvider.getProviderInstance().getLogs({
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
          this.blockLogs.set(i, []);
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
            this.blockLogs.set(pushingBlock, [...pushingLogs]);
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
        this.blockLogs.set(pushingBlock, [...pushingLogs]);
      }

      // Get logs contained in the current block
      const logs = this.blockLogs.get(currentBlockNumber);
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
        let block = this.blocksMap.get(currentBlockNumber);
        if (
          !block ||
          (block.transactions as string[]).every((tx) => typeof tx === 'string')
        ) {
          block = await this.rpcProvider
            .getProviderInstance()
            .getBlockWithTransactions(currentBlockNumber);
          // May as well save this block in the blocksMap in case it turns out we need it in mapLogToContractEvent
          this.blocksMap.set(currentBlockNumber, block);
        }

        let mustReindex = false;
        for (const tx of block.transactions) {
          if (typeof tx === 'string') {
            throw Error('tx was a string, but should have been a TxResponse');
          }
          const txReceipt = await this.rpcProvider
            .getProviderInstance()
            .getTransactionReceipt(tx.hash);
          if (txReceipt.logs.length > 0) {
            verbose(
              `Proved ${currentBlockNumber} has logs, but weren't given any, will reindex`,
            );
            mustReindex = true;
            // Then the block has events, and they've not been indexed yet.
            // We exit out of this handler, and wait until they've been indexed.
            // We remove the empty array from blockLogs to cause the getLogs call to be made again
            this.blockLogs.delete(currentBlockNumber);
            // Now we've proved we're missing events, don't need to look at any other transactions in
            // this block.
            break;
          }
        }
        if (mustReindex) {
          continue;
        }
      }

      for (const log of logs) {
        // Find listeners that match the log
        const listeners = this.eventManager.getMatchingListeners(
          log.topics,
          log.address,
        );
        if (!listeners.length) {
          continue;
        }

        for (const listener of listeners) {
          // In order to parse the log, we need an ethers interface
          const iface = this.eventManager.getInterfaceByListener(listener);
          if (!iface) {
            output(
              `Failed to get an interface for a log with listener type ${listener.type}`,
            );
            continue;
          }

          const event = await this.mapLogToContractEvent(log, iface);
          if (!event) {
            output(
              `Failed to map log describing event ${listener.eventSignature} in transaction ${log.transactionHash} `,
            );
            continue;
          }

          // Call the handler in a blocking way to ensure events get processed sequentially
          await listener.handler(event, listener);
        }
      }

      verbose('processed block', currentBlockNumber);

      lastBlockNumber = currentBlockNumber;
      this.statsManager.setLastBlockNumber(currentBlockNumber);
      this.blockLogs.delete(currentBlockNumber);
      this.blocksMap.delete(currentBlockNumber);
    }

    this.isProcessing = false;
  }

  public mapLogToContractEvent = async (
    log: Log,
    iface: utils.Interface,
  ): Promise<ContractEvent | null> => {
    const {
      transactionHash,
      logIndex,
      blockNumber,
      address: eventContractAddress,
    } = log;

    try {
      // Attempt to first get a block from the map as we might have already fetched its info
      let block = this.blocksMap.get(blockNumber);
      if (!block) {
        block = await this.rpcProvider
          .getProviderInstance()
          .getBlock(blockNumber);
        this.blocksMap.set(blockNumber, block);
      }

      const { hash: blockHash, timestamp } = block;
      const parsedLog = iface.parseLog(log);

      return {
        ...parsedLog,
        blockNumber,
        transactionHash,
        logIndex,
        contractAddress: eventContractAddress,
        blockHash,
        timestamp,
      };
    } catch (error) {
      /*
       * Silent Error
       *
       * This does not need to be loud since, at times, you'll map through a whole
       * lot of events which might not know how to interface with since they were
       * generated by other contracts
       */
      return null;
    }
  };
}
