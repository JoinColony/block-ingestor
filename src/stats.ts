import express from 'express';
import storage from 'node-persist';

import { getLatestBlock, getStats, output } from '~utils';
import { getChainId } from '~provider';

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
  const stats = await getStats();
  res.type('json').send(stats);
});

export const startStatsServer = async (): Promise<void> => {
  if (!port) {
    return;
  }

  await storage.init({
    dir: './stats/',
  });
  const latestBlock = await getLatestBlock();

  app.listen(port, async () => {
    output('Block Ingestor started on chain', getChainId());
    output(`Stats available at http://localhost:${port}/stats`);
    output(`Liveness check available at http://localhost:${port}/liveness`);
    output(`Last processed block number: ${latestBlock}`);
  });
};
