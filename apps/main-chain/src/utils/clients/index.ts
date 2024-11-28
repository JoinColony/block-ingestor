import { ClientType } from '@colony/colony-js';

import networkClient from '~networkClient';
import { NetworkClients } from '~types';

import { getCachedColonyClient } from './colony';
import { getVotingClient } from './voting';

export * from './colony';
export * from './voting';
export * from './stakedExpenditure';
export * from './stagedExpenditure';
export * from './streamingPayments';
export * from './oneTxPayment';
export * from './token';

/**
 * Function returning a (hopefully) cached client for the given type and colony address
 * Currently, it supports colony and voting clients, for other client types it returns the network client
 *
 * @TODO Handle getting token client
 */
export const getClient = async (
  clientType: ClientType,
  colonyAddress: string,
): Promise<NetworkClients | null> => {
  let client: NetworkClients | null = networkClient;

  switch (clientType) {
    case ClientType.ColonyClient: {
      client = await getCachedColonyClient(colonyAddress);
      break;
    }
    case ClientType.VotingReputationClient: {
      client = await getVotingClient(colonyAddress);
      break;
    }
    default: {
      break;
    }
  }

  return client;
};
