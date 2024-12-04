import {
  CreateStatsDocument,
  CreateStatsMutation,
  CreateStatsMutationVariables,
  GetStatsDocument,
  GetStatsQuery,
  GetStatsQueryVariables,
  UpdateStatsDocument,
  UpdateStatsMutation,
  UpdateStatsMutationVariables,
} from '@joincolony/graphql';
import { output, verbose } from '@joincolony/utils';
import { type AmplifyClient, type RpcProvider } from '@joincolony/clients';
import { ObjectOrFunction } from './types';

export class StatsManager {
  private stats: Record<string, unknown> = {};
  private readonly rpcProvider: RpcProvider;
  private readonly amplifyClient: AmplifyClient;
  private statsId: string;

  constructor(amplifyClient: AmplifyClient, rpcProvider: RpcProvider) {
    this.amplifyClient = amplifyClient;
    this.rpcProvider = rpcProvider;
    this.statsId = '';
  }

  /**
   * Update stats with a given argument.
   * Accepts either an object fragment (or full object) to append to stats,
   * or a callback (receives current stats) that returns the new object to write back.
   */
  public async updateStats(objectOrFunction: ObjectOrFunction): Promise<void> {
    if (typeof objectOrFunction === 'function') {
      this.stats = {
        ...this.stats,
        ...objectOrFunction(this.stats),
      };
    } else {
      this.stats = {
        ...this.stats,
        ...objectOrFunction,
      };
    }

    await this.amplifyClient.mutate<
      UpdateStatsMutation,
      UpdateStatsMutationVariables
    >(UpdateStatsDocument, {
      id: this.statsId,
      chainId: this.rpcProvider.getChainId(),
      value: JSON.stringify(this.stats),
    });

    verbose('Stats file updated');
  }

  // Return a copy of the current stats to avoid accidental overwrites
  public getStats(): typeof this.stats {
    return { ...this.stats };
  }

  public getLastBlockNumber(): number {
    if (Number.isInteger(this.stats.lastBlockNumber)) {
      return Number(this.stats.lastBlockNumber);
    }
    throw new Error('Could not get last block number from stats. Aborting.');
  }

  public setLastBlockNumber(lastBlockNumber: number): void {
    this.updateStats({ lastBlockNumber });
  }

  /**
   * Fetch the last stored stats from the DB.
   * If no stats entry is found, it will create one.
   */
  public async initStats(): Promise<void> {
    // @TODO need to find a better way for this as something is messed up with the instances
    if (!this.rpcProvider.isInitialised) {
      output('Force RPC provider initialisation');
      await this.rpcProvider.initialiseProvider();
    }
    const { value: jsonStats, id: statsId } =
      (
        await this.amplifyClient.query<GetStatsQuery, GetStatsQueryVariables>(
          GetStatsDocument,
          {
            chainId: this.rpcProvider.getChainId(),
          },
        )
      )?.data?.getIngestorStatsByChainId?.items?.[0] ?? {};

    if (statsId) {
      this.statsId = statsId;
    }

    if (!jsonStats) {
      this.stats = { lastBlockNumber: 0 };

      const statsResponse = await this.amplifyClient.mutate<
        CreateStatsMutation,
        CreateStatsMutationVariables
      >(CreateStatsDocument, {
        chainId: this.rpcProvider.getChainId(),
        value: JSON.stringify(this.stats),
      });

      if (statsResponse?.data?.createIngestorStats?.id) {
        this.statsId = statsResponse?.data?.createIngestorStats?.id;
      }
    
    } else {
      try {
        this.stats = JSON.parse(jsonStats);
      } catch {
        output(
          'Could not parse stats from the DB. The value is not a valid JSON.',
        );
      }
    }
  }
}
