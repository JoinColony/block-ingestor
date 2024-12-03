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
import { AmplifyClient } from '@joincolony/clients';
import { ObjectOrFunction } from './types';

export class StatsManager {
  private stats: Record<string, unknown> = {};
  private amplifyClient: AmplifyClient;

  constructor(amplifyClient: AmplifyClient) {
    this.amplifyClient = amplifyClient;
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
  // @TODO make stats work with chainId
  public async initStats(): Promise<void> {
    const { value: jsonStats } =
      (
        await this.amplifyClient.query<GetStatsQuery, GetStatsQueryVariables>(
          GetStatsDocument,
          {},
        )
      )?.data?.getIngestorStats ?? {};

    if (!jsonStats) {
      this.stats = { lastBlockNumber: 0 };

      await this.amplifyClient.mutate<
        CreateStatsMutation,
        CreateStatsMutationVariables
      >(CreateStatsDocument, {
        value: JSON.stringify(this.stats),
      });
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
