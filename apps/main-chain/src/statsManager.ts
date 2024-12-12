import { StatsManager } from '@joincolony/blocks';
import amplifyClient from './amplifyClient';
import rpcProvider from '~provider';

const statsManager = new StatsManager(amplifyClient, rpcProvider);

export default statsManager;
