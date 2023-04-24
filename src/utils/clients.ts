import {
  AnyColonyClient,
  AnyVotingReputationClient,
  ColonyClientV1,
  ColonyClientV2,
  ColonyClientV3,
  ColonyClientV4,
  Extension,
} from '@colony/colony-js';
import networkClient from '../networkClient';

export const getVotingClient = async (
  colonyAddress: string,
): Promise<AnyVotingReputationClient> => {
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  return await colonyClient.getExtensionClient(Extension.VotingReputation);
};

/**
 * A utility to check for the presence of the `getDomainFromFundingPot` method, which is only
 * available on ColonyClientV5 and above. The following type predicate allows to check
 * we're dealing with a client that supports this method.
 */
type SupportedColonyClient = Exclude<
  AnyColonyClient,
  ColonyClientV1 | ColonyClientV2 | ColonyClientV3 | ColonyClientV4
>;
export const isSupportedColonyClient = (
  colonyClient: AnyColonyClient,
): colonyClient is SupportedColonyClient =>
  (colonyClient as SupportedColonyClient).getDomainFromFundingPot !== undefined;
