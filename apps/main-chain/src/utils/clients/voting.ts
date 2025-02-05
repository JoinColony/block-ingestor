import {
  AnyMultisigPermissionsClient,
  AnyVotingReputationClient,
  Extension,
} from '@colony/colony-js';
import { getCachedColonyClient } from './colony';

// @TODO: Cache voting clients
export const getVotingClient = async (
  colonyAddress: string,
): Promise<AnyVotingReputationClient | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  try {
    return await colonyClient.getExtensionClient(Extension.VotingReputation);
  } catch {
    // `getExtensionClient` will throw an error if Voting Rep is not installed, hence the try/catch block
    return null;
  }
};

export const getMultiSigClient = async (
  colonyAddress: string,
): Promise<AnyMultisigPermissionsClient | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return null;
  }

  try {
    return await colonyClient.getExtensionClient(Extension.MultisigPermissions);
  } catch {
    // `getExtensionClient` will throw an error if MultiSig is not installed, hence the try/catch block
    return null;
  }
};
