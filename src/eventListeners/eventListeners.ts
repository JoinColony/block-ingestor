import { verbose } from '~utils';

import { EventListener } from './types';

let listeners: EventListener[] = [];

export const getEventListeners = (): EventListener[] => listeners;

export const setEventListeners = (newListeners: EventListener[]): void => {
  listeners = newListeners;
};

export const addEventListener = (listener: EventListener): void => {
  verbose(
    `Added listener for event ${listener.eventSignature}`,
    listener.address ? `filtering address ${listener.address}` : '',
  );
  listeners.push(listener);
};

export const getMatchingListeners = (
  logTopics: string[],
  logAddress: string,
): EventListener[] => {
  return listeners.filter((listener) => {
    if (listener.address && logAddress !== listener.address) {
      return false;
    }

    if (listener.topics.length > logTopics.length) {
      return false;
    }

    return listener.topics.every((topic, index) => {
      if (topic === null) {
        // if listener topic is null, skip the check
        return true;
      }

      return topic.toLowerCase() === logTopics[index].toLowerCase();
    });
  });
};

export const getListenersStats = (): string => JSON.stringify(listeners);
