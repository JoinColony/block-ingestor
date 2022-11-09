import express, { Request, Response } from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import { utils } from 'ethers';

import blockListener from './blockListener';
import trackColonies from './trackColonies';
import eventListener from './eventListener';
import amplifyClientSetup from './amplifyClient';
import provider, { getChainId } from './provider';
import { output, readJsonStats } from './utils';

dotenv.config();
utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const app = express();
const port = process.env.STATS_PORT;

app.get('/', (req: Request, res: Response) => {
  res.type('text/plain').send(process.env.NODE_ENV !== 'production' ? 'Block Ingestor' : '');
});

/*
 * Use to check if service is alive
 */
app.get('/liveness', (req, res) => res.sendStatus(200));

/*
 * Use to check various service stats
 */
app.get('/stats', (req, res) => {
  readJsonStats().then(
    stats => res.type('json').send(stats),
  );
});

const startStatsServer = async (): Promise<Server> => app.listen(port, async () => {
  /*
   * Need to run this first, otherwise it won't set the chain internally
   * Maybe a good idea would be to refactor this store the network inside the provider
   * so that way we'll fetch it on provider initialization
   */
  await provider.getNetwork();
  output('Block Ingestor started on chain', getChainId());
  output(`Stats available at http://localhost:${port}/stats`);
  output(`Liveness check available at http://localhost:${port}/liveness`);
});

const startIngestor = async (): Promise<void> => {
  /*
  * Get all colonies currently deployed
  */
  await trackColonies();
  /*
   * Setup all listeners we care about
   */
  await blockListener();
  await eventListener();
};

const start = async (): Promise<void> => {
  if (port) {
    await startStatsServer();
  }
  startIngestor();
  amplifyClientSetup();
};

start();
