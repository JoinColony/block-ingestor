import dotenv from 'dotenv';
import { utils } from 'ethers';

import { startBlockListener } from '~blockListener';
import amplifyClientSetup from '~amplifyClient';
import { initialiseProvider } from '~provider';
import { startStatsServer } from '~stats';
import {
  setupListenersForColonies,
  setupListenersForExtensions,
} from '~eventListeners';
import { seedDB } from '~utils';

dotenv.config();
utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const start = async (): Promise<void> => {
  amplifyClientSetup();

  /**
   * Start express server providing stats and fetch existing stats from the DB
   */
  await startStatsServer();

  /**
   * Setup the listeners we care about for existing colonies, extensions
   * This has to be done before the block listener is started to ensure the events are not missed
   */
  await setupListenersForColonies();
  await setupListenersForExtensions();

  /**
   * Start the main block listener
   */
  startBlockListener();

  await initialiseProvider();

  /**
   * In development, where both the chain and the DB gets reset everytime,
   * we need to "seed" some initial data, such as versions or the current network fee
   * In live environments, these values will already have been saved in the DB
   */
  if (process.env.NODE_ENV === 'development') {
    await seedDB();
  }
};

start();
