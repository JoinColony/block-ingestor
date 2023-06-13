import dotenv from 'dotenv';
import { utils } from 'ethers';

import { startBlockListener } from '~blockListener';
import amplifyClientSetup from '~amplifyClient';
import { initialiseProvider } from '~provider';
// import trackNetworkInverseFee from '~trackNetworkInverseFee';
import { startStatsServer } from '~stats';
import {
  setupListenersForExistingColonies,
  setupListenersForExistingExtensions,
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

  startBlockListener();

  setupListenersForExistingColonies();

  setupListenersForExistingExtensions();

  await initialiseProvider();

  await startStatsServer();
};

start();
