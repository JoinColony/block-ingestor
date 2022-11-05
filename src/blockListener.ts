import { JsonRpcProvider } from '@ethersproject/providers';

import provider from './provider';
import { verbose, writeJsonStats } from './utils';

const blockListener = (): JsonRpcProvider => provider.on('block', async (blockNumber) => {
  verbose(`Processing block #${blockNumber}`);
  await writeJsonStats({ latestBlock: blockNumber });
});

export default blockListener;
