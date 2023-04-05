import { getExtensionHash } from '@colony/colony-js';

import {
  addColonyEventListener,
  addExtensionEventListener,
  addNetworkEventListener,
  addTokenEventListener,
  addActionEventListeners,
} from './utils';
import { ContractEventsSignatures } from './types';
import { INITIALISABLE_EXTENSION_IDS } from './constants';

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
  await addColonyEventListener(
    ContractEventsSignatures.ColonyUpgraded,
    colonyAddress,
  );
  await addTokenEventListener(ContractEventsSignatures.Transfer, colonyAddress);
  await addActionEventListeners(colonyAddress);
};

export const extensionSpecificEventsListener = async (
  extensionAddress: string,
  extensionHash: string,
): Promise<void> => {
  const isInitialisable = INITIALISABLE_EXTENSION_IDS.some(
    (extensionId) => getExtensionHash(extensionId) === extensionHash,
  );
  if (isInitialisable) {
    await addExtensionEventListener(
      ContractEventsSignatures.ExtensionInitialised,
      extensionAddress,
    );
  }
};

const eventListener = async (): Promise<void> => {
  await addNetworkEventListener(
    ContractEventsSignatures.ExtensionAddedToNetwork,
  );
  await addNetworkEventListener(ContractEventsSignatures.ExtensionInstalled);
  await addNetworkEventListener(ContractEventsSignatures.ExtensionUninstalled);
  await addNetworkEventListener(ContractEventsSignatures.ExtensionDeprecated);
  await addNetworkEventListener(ContractEventsSignatures.ExtensionUpgraded);

  await addNetworkEventListener(ContractEventsSignatures.ColonyVersionAdded);

  await addNetworkEventListener(ContractEventsSignatures.NetworkFeeInverseSet);
};

export default eventListener;
