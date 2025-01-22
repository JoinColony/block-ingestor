import 'cross-fetch/polyfill';
import { utils } from 'ethers';

import '~amplifyClient';
import '~eventManager';
import blockManager from '~blockManager';
import rpcProvider from '~provider';
import { startStatsServer } from '~stats';
import { setupListenersForColonies } from '~eventListeners';
import { addChainToDB } from '~utils/addChainToDB';
import '~utils/cleanup';

utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const start = async (): Promise<void> => {
  await rpcProvider.initialiseProvider();

  await addChainToDB();
  /**
   * Start express server providing stats and fetch existing stats from the DB
   */
  await startStatsServer();

  /**
   * Setup the listeners we care about for existing colonies
   * This has to be done before the block listener is started to ensure the events are not missed
   */
  await setupListenersForColonies();

  /**
   * Start the main block listener
   */
  blockManager.startBlockListener();

  console.log('started');
};

start();
