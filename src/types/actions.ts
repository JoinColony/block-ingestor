import { ContractEvent } from './events';

export type ColonyActionHandler = (event: ContractEvent) => Promise<void>;
