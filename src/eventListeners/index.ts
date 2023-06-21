import { utils } from 'ethers';

import { verbose } from '~utils';
import { ContractEventsSignatures } from '~types';

import { EventListener } from './types';

export * from './colony';
export * from './network';
export * from './extensions';
export * from './token';

let listeners: EventListener[] = [];

export const addEventListener = (
  listener: Omit<EventListener, 'topic'>,
): void => {
  verbose(
    `Added listener for event ${listener.eventSignature}`,
    listener.address ? `filtering address ${listener.address}` : '',
  );
  listeners.push({ ...listener, topic: utils.id(listener.eventSignature) });
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

export const getListenersLogTopics = (): string[][] => [
  listeners.map((listener) => listener.topic),
];

/**
 * @TODO: Implement proper logic for matching logs, as described in https://docs.ethers.org/v5/concepts/events/#events--logs-and-filtering
 * Right now the simplified version only checks if the listener topic (and there can only be a single one) exist in the log's topics array
 */
export const getMatchingListener = (
  logTopics: string[],
  address: string,
): EventListener | null => {
  return (
    listeners.find(
      (listener) =>
        logTopics.includes(utils.id(listener.eventSignature)) &&
        (!listener.address ||
          listener.address === address ||
          // Extra check for handling token events, where we want to filter logs with the address being the recipient
          logTopics[2] === address),
    ) ?? null
  );
};

export const getListenersStats = (): string => JSON.stringify(listeners);
