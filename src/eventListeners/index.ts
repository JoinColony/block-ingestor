import { utils } from 'ethers';

import { verbose } from '~utils';

import { EventListener } from './types';

export * from './colony';
export * from './network';
export * from './extensions';

const listeners: EventListener[] = [];

export const addEventListener = (listener: EventListener): void => {
  verbose(
    `Added listener for event ${listener.eventSignature}`,
    listener.address ? `filtering address ${listener.address}` : '',
  );
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
