import express from 'express';

import { getLastBlockNumber, getStats, initStats } from '~utils';
import { getListenersStats } from '~eventListeners';
import rpcProvider from '~provider';
import { output } from '@joincolony/utils';

export const coloniesSet = new Set<string>();

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
  const stats = getStats();
  res.type('json').send(stats);
});

/**
 * Use to check currently active listeners
 */
app.get('/listeners', async (_, res) => {
  res.type('json').send(getListenersStats());
});

export const startStatsServer = async (): Promise<void> => {
  if (!port) {
    return;
  }

  await initStats();
  const lastBlockNumber = getLastBlockNumber();

  app.listen(port, async () => {
    output('Block Ingestor started on chain', rpcProvider.getChainId());
    output(`Stats available at http://localhost:${port}/stats`);
    output(`Liveness check available at http://localhost:${port}/liveness`);
    output(`Last processed block number: ${lastBlockNumber}`);
  });
};
