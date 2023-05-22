import { AnyVotingReputationClient, Extension } from '@colony/colony-js';
import { getCachedColonyClient } from './colony';

export const getVotingClient = async (
  colonyAddress: string,
): Promise<AnyVotingReputationClient> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  return await colonyClient.getExtensionClient(Extension.VotingReputation);
};
