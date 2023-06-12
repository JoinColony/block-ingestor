import { ClientType } from '@colony/colony-js';
import { utils } from 'ethers';
import { ContractEvent, ContractEventsSignatures } from '~types';

export * from './colony';

type EventHandler = (event: ContractEvent) => void | Promise<void>;

interface EventListener {
  eventSignature: ContractEventsSignatures;
  clientType: ClientType;
  address: string;
  handler: EventHandler;
}

const listeners: EventListener[] = [];

export const addColonyEventListener = (
  eventSignature: ContractEventsSignatures,
  address: string,
  handler: EventHandler,
): void => {
  listeners.push({
    clientType: ClientType.ColonyClient,
    eventSignature,
    address,
    handler,
  });
};

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
