import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.STATS_PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log('Transactions Ingestor is Running');
  console.log(`Stats available at https://localhost:${port}/stats`);
  console.log(`Liveness check available at https://localhost:${port}/liveness`);
});
