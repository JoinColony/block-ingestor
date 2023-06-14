import {
  addNetworkEventListener,
  addTokenEventListener,
  addMotionEventListener,
} from './utils';
import { ContractEventsSignatures } from '~types';

/*
 * All events that need to be tracked on a single colony go in here
 * as this will get linked in all the relevant places
 */
export const colonySpecificEventsListener = async (
  colonyAddress: string,
): Promise<void> => {
  await addTokenEventListener(ContractEventsSignatures.Transfer, colonyAddress);
};

export const motionSpecificEventsListener = async (
  colonyAddress: string,
): Promise<void> => {
  await addMotionEventListener(
    ContractEventsSignatures.MotionCreated,
    colonyAddress,
  );
  await addMotionEventListener(
    ContractEventsSignatures.MotionStaked,
    colonyAddress,
  );
  await addMotionEventListener(
    ContractEventsSignatures.MotionFinalized,
    colonyAddress,
  );
  await addMotionEventListener(
    ContractEventsSignatures.MotionRewardClaimed,
    colonyAddress,
  );
  await addMotionEventListener(
    ContractEventsSignatures.MotionVoteSubmitted,
    colonyAddress,
  );
  await addMotionEventListener(
    ContractEventsSignatures.MotionVoteRevealed,
    colonyAddress,
  );
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
