import 'cross-fetch/polyfill';
import { utils } from 'ethers';

/*
import { startBlockListener } from '~blockListener';
import amplifyClientSetup from '~amplifyClient';
import { initialiseProvider } from '@joincolony/clients';
*/

utils.Logger.setLogLevel(utils.Logger.levels.ERROR);

const start = async (): Promise<void> => {
  /*
  amplifyClientSetup();
  startBlockListener();
  await initialiseProvider();
  */
  console.log('started');
};

start();
