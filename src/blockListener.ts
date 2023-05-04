import networkClient from './networkClient';
import { updateStats, verbose } from './utils';
import { EthersObserverEvents } from './types';

const blockListener = (): typeof networkClient.provider =>
  networkClient.provider.on(EthersObserverEvents.Block, async (blockNumber) => {
    verbose('Processing block #', blockNumber);
    await updateStats({ latestBlock: blockNumber });
  });

export default blockListener;
