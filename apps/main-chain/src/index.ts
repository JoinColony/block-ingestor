/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config();

import 'cross-fetch/polyfill';
import { utils } from 'ethers';

import '~amplifyClient';
import '~statsManager';
import '~eventManager';
import blockManager from '~blockManager';
import { startStatsServer } from '~stats';
import {
  setupListenersForColonies,
  setupListenersForExtensions,
} from '~eventListeners';
import { seedDB } from '~utils';
import rpcProvider from './provider';
import { setupNotificationsClient } from '~utils/notifications';

utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const start = async (): Promise<void> => {
  await rpcProvider.initialiseProvider();
  /**
   * Setup the notifications provider so that notifications can be sent when needed
   */
  await setupNotificationsClient();

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
  blockManager.startBlockListener();

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
