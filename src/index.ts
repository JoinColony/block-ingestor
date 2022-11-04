import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import blockListener from './blockListener';
import trackColonies from './trackColonies';
import { output, readJsonStats } from './utils';

import { name, version } from '../package.json';

dotenv.config();

const app = express();
const port = process.env.STATS_PORT;

app.get('/', (req: Request, res: Response) => {
  res.type('text/plain').send(`${name}@${version}`);
});

app.get('/liveness', (req, res) => res.sendStatus(200));

app.get('/stats', (req, res) => {
  readJsonStats().then(
    stats => res.type('json').send(stats),
    () => {},
  );
});

blockListener();

trackColonies();

app.listen(port, () => {
  output('Transactions Ingestor is Running');
  output(`Stats available at http://localhost:${port}/stats`);
  output(`Liveness check available at http://localhost:${port}/liveness`);
});
