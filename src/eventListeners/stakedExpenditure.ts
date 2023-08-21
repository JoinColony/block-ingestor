import { utils } from 'ethers';

import { ContractEventsSignatures } from '~types';
import { EventListenerType, addEventListener } from '~eventListeners';

export const addStakedExpenditureEventListener = (
  eventSignature: ContractEventsSignatures,
  extensionAddress: string,
  colonyAddress: string,
): void => {
  addEventListener({
    type: EventListenerType.StakedExpenditure,
    eventSignature,
    address: extensionAddress,
    colonyAddress,
    topics: [utils.id(eventSignature)],
  });
};

export const setupListenersForStakedExpenditure = (
  stakedExpenditureAddress: string,
  colonyAddress: string,
  isInitialized: boolean,
): void => {
  if (isInitialized) {
    return;
  }

  addStakedExpenditureEventListener(
    ContractEventsSignatures.ExtensionInitialised,
    stakedExpenditureAddress,
    colonyAddress,
  );
};
