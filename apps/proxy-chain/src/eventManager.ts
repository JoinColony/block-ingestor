import { EventManager } from '@joincolony/blocks';
import rpcProvider from '~provider';

const eventManager = new EventManager(rpcProvider);

export default eventManager;
