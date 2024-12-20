import { BlockManager } from '@joincolony/blocks';
import eventManager from '~eventManager';
import rpcProvider from '~provider';
import statsManager from '~statsManager';

const blockManager = new BlockManager(eventManager, rpcProvider, statsManager);

export default blockManager;
