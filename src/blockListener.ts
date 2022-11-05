import networkClient from './networkClient';
import { verbose, writeJsonStats } from './utils';
import { EthersObserverEvents } from './types';

const blockListener = (): typeof networkClient.provider =>
  networkClient.provider.on(
    EthersObserverEvents.Block,
    async (blockNumber) => {
      verbose('Processing block #', blockNumber);
      await writeJsonStats({ latestBlock: blockNumber });
    },
  );

export default blockListener;
