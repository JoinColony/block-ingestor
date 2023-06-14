import { ClientType } from '@colony/colony-js';

import networkClient from '~networkClient';
import { ContractEventsSignatures } from '~types';

import { eventListenerGenerator } from './eventListenerGenerator';
/**
 * Network Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addNetworkEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string = networkClient.address,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.NetworkClient,
  );

/**
 * Colony Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addColonyEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.ColonyClient,
  );

/**
 * Token Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addTokenEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.TokenClient,
  );

export const addMotionEventListener = async (
  eventSignature: ContractEventsSignatures,
  colonyAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    colonyAddress,
    ClientType.VotingReputationClient,
    true,
  );
