import {
  addColonyEventListener,
  addNetworkEventListener,
  addTokenEventListener,
} from './utils';
import { ContractEventsSignatures } from './types';

/*
 * All events that need to be tracked on a single colony go in here
 * as this will get linked in all the relevant places
 */
export const colonySpecificEventsListener = async (
  colonyAddress: string,
): Promise<void> => {
  await addColonyEventListener(
    ContractEventsSignatures.ColonyFundsClaimed,
    colonyAddress,
  );
  await addTokenEventListener(ContractEventsSignatures.Transfer, colonyAddress);
};

/*
 * No general, global level (basically network) events to listen to currently
 */
const eventListener = async (): Promise<void> => {
  await addNetworkEventListener(ContractEventsSignatures.ExtensionInstalled);
  await addNetworkEventListener(ContractEventsSignatures.ExtensionUninstalled);
  await addNetworkEventListener(ContractEventsSignatures.ExtensionDeprecated);
  await addNetworkEventListener(ContractEventsSignatures.ExtensionUpgraded);
};

export default eventListener;
