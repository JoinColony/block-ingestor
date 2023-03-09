import { Extension } from '@colony/colony-js';
import networkClient from '~networkClient';

export const getVotingClient = async (colonyAddress: string) => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  return await colonyClient.getExtensionClient(Extension.VotingReputation);
};
