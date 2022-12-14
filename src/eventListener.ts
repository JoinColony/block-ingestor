import { addColonyEventListener, addTokenEventListener } from './utils';
import { ContractEventsSignatures } from './types';

/*
 * All events that need to be tracked on a single colony go in here
 * as this will get linked in all the relevant places
 */
export const colonySpecificEventsListener = async (colonyAddress: string): Promise<void> => {
  await addColonyEventListener(ContractEventsSignatures.ColonyFundsClaimed, colonyAddress);
  await addTokenEventListener(ContractEventsSignatures.Transfer, colonyAddress);
};

const eventListener = async (): Promise<void> => {
  /*
   * No general, global level (basically network) events to listen to currently
   */
};

export default eventListener;
