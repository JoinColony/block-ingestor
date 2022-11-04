import { JsonRpcProvider } from '@ethersproject/providers';
import provider from './provider';

import { output, writeJsonStats } from './utils';

const blockListener = (): JsonRpcProvider => provider.on('block', async (blockNumber) => {
  output(`Processing block #${blockNumber}`);
  await writeJsonStats({ latestBlock: blockNumber });
});

export default blockListener;
