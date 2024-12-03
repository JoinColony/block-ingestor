import 'cross-fetch/polyfill';
import { utils } from 'ethers';

import '~amplifyClient';
import '~eventManager';
import blockManager from '~blockManager';
import rpcProvider from '~provider';
import { startStatsServer } from '~stats';

utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const start = async (): Promise<void> => {
  await rpcProvider.initialiseProvider();
  /**
   * Start express server providing stats and fetch existing stats from the DB
   */
  await startStatsServer();

  /**
   * Start the main block listener
   */
  blockManager.startBlockListener();
  
  console.log('started');
};

start();
