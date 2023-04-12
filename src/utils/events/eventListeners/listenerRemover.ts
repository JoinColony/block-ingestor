import { ClientType } from '@colony/colony-js';

import { ContractEventsSignatures } from '~types';

export type ListenerRemover = () => void;

const removers: Record<string, ListenerRemover> = {};

export const saveRemover = (
  contractAddress: string,
  clientType: ClientType,
  eventSignature: ContractEventsSignatures,
  listenerRemover: ListenerRemover,
): void => {
  const listenerRemoverKey = generateListenerRemoverKey(
    contractAddress,
    clientType,
    eventSignature,
  );
  removers[listenerRemoverKey] = listenerRemover;
};

/**  Generate a unique key for the listenerRemover. */
const generateListenerRemoverKey = (
  contractAddress: string,
  clientType: ClientType,
  eventSignature: ContractEventsSignatures,
): string => `${contractAddress}-${clientType}-${eventSignature}`;

const removeListeners = (listenerRemovers: ListenerRemover[]): void => {
  listenerRemovers.forEach((listenerRemover) => {
    listenerRemover();
  });
};

const getRemovers = (keys: string[]): ListenerRemover[] => {
  const listenerRemovers: ListenerRemover[] = [];

  keys.forEach((key) => {
    const motionListenerRemover = removers[key];

    if (motionListenerRemover) {
      listenerRemovers.push(motionListenerRemover);
    }
  });

  return listenerRemovers;
};

const getMotionRemoverKeys = (colonyAddress: string): string[] => {
  const motionSignatures = Object.values(ContractEventsSignatures).filter(
    (sig) => sig.includes('Motion'),
  );

  return motionSignatures.map((signature) =>
    generateListenerRemoverKey(
      colonyAddress,
      ClientType.VotingReputationClient,
      signature,
    ),
  );
};

export const removeMotionListeners = (colonyAddress: string): void => {
  const keys = getMotionRemoverKeys(colonyAddress);
  const motionRemovers = getRemovers(keys);
  removeListeners(motionRemovers);
};
