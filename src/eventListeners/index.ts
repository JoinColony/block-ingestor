import { utils } from 'ethers';

import { verbose } from '~utils';

import { EventListener } from './types';

export * from './colony';
export * from './network';
export * from './extensions';

const listeners: EventListener[] = [];

export const addEventListener = (
  listener: Omit<EventListener, 'topic'>,
): void => {
  verbose(
    `Added listener for event ${listener.eventSignature}`,
    listener.address ? `filtering address ${listener.address}` : '',
  );
  listeners.push({ ...listener, topic: utils.id(listener.eventSignature) });
};

// @TODO: removeEventListener function

export const getListenersLogTopics = (): string[][] => [
  listeners.map((listener) => listener.topic),
];

export const getMatchingListener = (
  logTopics: string[],
  address: string,
): EventListener | null => {
  return (
    listeners.find(
      (listener) =>
        logTopics.includes(utils.id(listener.eventSignature)) &&
        (!listener.address || listener.address === address),
    ) ?? null
  );
};

export const getListenersStats = (): string => JSON.stringify(listeners);
