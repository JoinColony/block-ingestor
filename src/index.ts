import dotenv from 'dotenv';
import { utils } from 'ethers';

import { startBlockListener } from '~blockListener';
import amplifyClientSetup from '~amplifyClient';
import { initialiseProvider } from '~provider';
// import trackNetworkInverseFee from '~trackNetworkInverseFee';
import { startStatsServer } from '~stats';
import {
  setupListenersForColonies,
  setupListenersForExtensions,
} from '~eventListeners';

dotenv.config();
utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

// const startIngestor = async (): Promise<void> => {

//   /*
//    * Get initial network inverse fee and setup listener for future ones
//    */
//   await trackNetworkInverseFee();
// };

const start = async (): Promise<void> => {
  amplifyClientSetup();

  await startStatsServer();

  await setupListenersForColonies();

  await setupListenersForExtensions();

  startBlockListener();

  await initialiseProvider();
};

start();
