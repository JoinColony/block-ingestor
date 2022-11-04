import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import blockListener from './blockListener';
import { readJsonStats } from './utils';

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

app.listen(port, () => {
  console.log('Transactions Ingestor is Running');
  console.log(`Stats available at http://localhost:${port}/stats`);
  console.log(`Liveness check available at http://localhost:${port}/liveness`);
});
