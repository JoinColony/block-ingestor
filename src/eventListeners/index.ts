import { verbose } from '~utils';
import { ContractEventsSignatures } from '~types';

import { EventListener, EventListenerType } from './types';

export * from './types';
export * from './colony';
export * from './network';
export * from './extensions';
export * from './token';

let listeners: EventListener[] = [];

export const addEventListener = (listener: EventListener): void => {
  verbose(
    `Added listener for event ${listener.eventSignature}`,
    listener.address ? `filtering address ${listener.address}` : '',
  );
  listeners.push(listener);
};

export const removeEventListener = (
  eventSignature: ContractEventsSignatures,
  address?: string,
): void => {
  verbose(
    `Removed listener for event ${eventSignature}`,
    address ? `filtering address ${address}` : '',
  );
  listeners = listeners.filter(
    (listener) =>
      listener.eventSignature !== eventSignature ||
      listener.address !== address,
  );
};

export const getMatchingListener = (
  logTopics: string[],
  logAddress: string,
): EventListener | null => {
  return (
    listeners.find((listener) => {
      if (listener.address && logAddress !== listener.address) {
        return false;
      }

      return listener.topics.every((topic, index) => {
        if (topic === null) {
          // if listener topic is null, skip the check
          return true;
        }

        return topic === logTopics[index];
      });
    }) ?? null
  );
};

export const getListenersStats = (): string => JSON.stringify(listeners);

export const getListenerContractEventProperties = (
  listener: EventListener,
): Record<string, unknown> => {
  switch (listener.type) {
    case EventListenerType.Extension: {
      return {
        colonyAddress: listener.colonyAddress,
      };
    }
    default:
      return {};
  }
};
