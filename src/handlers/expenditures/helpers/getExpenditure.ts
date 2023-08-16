import {
  AnyColonyClient,
  ColonyClientV1,
  ColonyClientV2,
  ColonyClientV3,
} from '@colony/colony-js';

import { query } from '~amplifyClient';
import {
  GetExpenditureDocument,
  GetExpenditureQuery,
  GetExpenditureQueryVariables,
} from '~graphql';
import { getCachedColonyClient } from '~utils';

export const getExpenditureFromDB = async (
  expenditureDatabaseId: string,
): Promise<GetExpenditureQuery['getExpenditure']> => {
  const response = await query<
    GetExpenditureQuery,
    GetExpenditureQueryVariables
  >(GetExpenditureDocument, {
    id: expenditureDatabaseId,
  });

  const expenditure = response?.data?.getExpenditure;

  return expenditure;
};

/**
 * Utility checking if `getExpenditure` function exists on the given colony client
 */
type GetExpenditureSupportedColonyClient = Exclude<
  AnyColonyClient,
  ColonyClientV1 | ColonyClientV2 | ColonyClientV3
>;
const isGetExpenditureSupported = (
  colonyClient: AnyColonyClient,
): colonyClient is GetExpenditureSupportedColonyClient =>
  (colonyClient as GetExpenditureSupportedColonyClient).getExpenditure !==
  undefined;

export const getExpenditure = async (
  colonyAddress: string,
  expenditureId: number,
): Promise<ReturnType<
  GetExpenditureSupportedColonyClient['getExpenditure']
> | null> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient || !isGetExpenditureSupported(colonyClient)) {
    return null;
  }

  try {
    const expenditure = await colonyClient.getExpenditure(expenditureId);
    return expenditure;
  } catch {
    return null;
  }
};
