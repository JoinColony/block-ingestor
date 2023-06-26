import {
  AnyColonyClient,
  ColonyClientV1,
  ColonyClientV2,
  ColonyClientV3,
  ColonyClientV4,
} from '@colony/colony-js';

export const getDomainDatabaseId = (
  colonyAddress: string,
  nativeId: number,
): string => `${colonyAddress}_${nativeId}`;

export const getPendingMetadataDatabaseId = (
  colonyAddress: string,
  transactionHash: string,
): string => `${colonyAddress}_motion-${transactionHash}`;

/**
 * A utility to check for the presence of the `getDomainFromFundingPot` method, which is only
 * available on ColonyClientV5 and above. The following type predicate allows to check
 * we're dealing with a client that supports this method.
 */
type SupportedColonyClient = Exclude<
  AnyColonyClient,
  ColonyClientV1 | ColonyClientV2 | ColonyClientV3 | ColonyClientV4
>;
export const isDomainFromFundingPotSupported = (
  colonyClient: AnyColonyClient,
): colonyClient is SupportedColonyClient =>
  (colonyClient as SupportedColonyClient).getDomainFromFundingPot !== undefined;
