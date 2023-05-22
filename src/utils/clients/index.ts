import { ClientType, Extension } from '@colony/colony-js';
import networkClient from '~networkClient';
import { NetworkClients } from '~types';
import { getCachedColonyClient } from '~utils';

export * from './colony';
export * from './voting';

/**
 * Function attempting to return a client of given type and contract address,
 * aiming to use cached clients wherever possible
 *
 * @TODO Handle getting token client, currently it simply returns the network client
 */
export const getClient = async (
  clientType: ClientType,
  contractAddress: string,
): Promise<NetworkClients> => {
  let client: NetworkClients = networkClient;

  switch (clientType) {
    case ClientType.ColonyClient: {
      client = await getCachedColonyClient(contractAddress);
      break;
    }
    case ClientType.VotingReputationClient: {
      const colonyClient = await getCachedColonyClient(contractAddress);
      client = await colonyClient.getExtensionClient(
        Extension.VotingReputation,
      );
      break;
    }
    default: {
      break;
    }
  }

  return client;
};
