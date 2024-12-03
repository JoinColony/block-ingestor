import { StatsManager } from '@joincolony/blocks';
import amplifyClient from './amplifyClient';

const statsManager = new StatsManager(amplifyClient);

export default statsManager;
