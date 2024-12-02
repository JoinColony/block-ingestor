import express from 'express';

import eventManager from '~eventManager';
import rpcProvider from '~provider';
import { output } from '@joincolony/utils';
import statsManager from '~statsManager';

// @NOTE this can probably be moved to the colonyAdded handler
export const coloniesSet = new Set<string>();

// @NOTE just copy this entire file later on for now
const app = express();
const port = process.env.STATS_PORT;

app.get('/', (_, res) => {
  res
    .type('text/plain')
    .send(process.env.NODE_ENV !== 'production' ? 'Block Ingestor' : '');
});

/*
 * Use to check if service is alive
 */
app.get('/liveness', (_, res) => res.sendStatus(200));

/*
 * Use to check various service stats
 */
app.get('/stats', async (_, res) => {
  const stats = statsManager.getStats();
  res.type('json').send(stats);
});

/**
 * Use to check currently active listeners
 */
app.get('/listeners', async (_, res) => {
  res.type('json').send(eventManager.getListenersStats());
});

export const startStatsServer = async (): Promise<void> => {
  if (!port) {
    return;
  }

  await statsManager.initStats();
  const lastBlockNumber = statsManager.getLastBlockNumber();

  app.listen(port, async () => {
    output('Block Ingestor started on chain', rpcProvider.getChainId());
    output(`Stats available at http://localhost:${port}/stats`);
    output(`Liveness check available at http://localhost:${port}/liveness`);
    output(`Last processed block number: ${lastBlockNumber}`);
  });
};
