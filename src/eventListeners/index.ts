import { utils } from 'ethers';

import { EventListener } from './types';

export * from './colony';

const listeners: EventListener[] = [];

export const addEventListener = (listener: EventListener): void => {
  listeners.push(listener);
};

// @TODO: removeEventListener function

export const getListenersLogTopics = (): string[][] => [
  listeners.map((listener) => utils.id(listener.eventSignature)),
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
