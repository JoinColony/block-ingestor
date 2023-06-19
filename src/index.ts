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

  await startStatsServer();

  await setupListenersForColonies();

  await setupListenersForExtensions();

  startBlockListener();

  await initialiseProvider();

  if (process.env.NODE_ENV === 'development') {
    await seedDB();
  }
};

start();
