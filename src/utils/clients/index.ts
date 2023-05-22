import { ClientType, Extension } from '@colony/colony-js';
import networkClient from '~networkClient';
import { NetworkClients } from '~types';
import { getCachedColonyClient } from '~utils';

export * from './colony';
export * from './voting';

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
  let client: NetworkClients = networkClient;

  switch (clientType) {
    case ClientType.ColonyClient: {
      client = await getCachedColonyClient(colonyAddress);
      break;
    }
    case ClientType.VotingReputationClient: {
      try {
        const colonyClient = await getCachedColonyClient(colonyAddress);
        client = await colonyClient.getExtensionClient(
          Extension.VotingReputation,
        );
      } catch {
        // `getExtensionClient` will throw an error if Voting Rep is not installed, hence the try/catch block
        return null;
      }

      break;
    }
    default: {
      break;
    }
  }

  return client;
};
