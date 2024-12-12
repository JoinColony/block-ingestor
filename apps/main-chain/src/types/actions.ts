import { ContractEvent } from '@joincolony/blocks';

export type ColonyActionHandler = (event: ContractEvent) => Promise<void>;
