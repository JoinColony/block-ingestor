import dotenv from 'dotenv';
import { utils } from 'ethers';

import blockListener from '~blockListener';
import trackColonies from '~trackColonies';
import eventListener from '~eventListener';
import amplifyClientSetup from '~amplifyClient';
import { initialiseProvider } from '~provider';
import trackExtensions from '~trackExtensions';
import trackNetworkInverseFee from '~trackNetworkInverseFee';
import { startStatsServer } from '~stats';

dotenv.config();
utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const startIngestor = async (): Promise<void> => {
  /*
   * Get all colonies currently deployed
   */
  await trackColonies();
  /*
   * Get all supported extensions currently installed in colonies
   */
  await trackExtensions();

  /*
   * Get initial network inverse fee and setup listener for future ones
   */
  await trackNetworkInverseFee();

  /*
   * Setup all listeners we care about
   */
  await blockListener();
  await eventListener();
};

const start = async (): Promise<void> => {
  await initialiseProvider();
  await startStatsServer();
  startIngestor();
  amplifyClientSetup();
};

start();
