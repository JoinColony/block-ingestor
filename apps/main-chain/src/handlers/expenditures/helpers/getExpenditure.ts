import { AnyColonyClient } from '@colony/colony-js';

import { query } from '~amplifyClient';
import {
  GetExpenditureDocument,
  GetExpenditureQuery,
  GetExpenditureQueryVariables,
  GetStreamingPaymentDocument,
  GetStreamingPaymentQuery,
  GetStreamingPaymentQueryVariables,
} from '@joincolony/graphql';
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
const isGetExpenditureSupported = (colonyClient: AnyColonyClient): boolean =>
  colonyClient.getExpenditure !== undefined;

export const getExpenditure = async (
  colonyAddress: string,
  expenditureId: number,
): Promise<ReturnType<AnyColonyClient['getExpenditure']> | null> => {
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

export const getStreamingPaymentFromDB = async (
  paymentDatabaseId: string,
): Promise<GetStreamingPaymentQuery['getStreamingPayment']> => {
  const response = await query<
    GetStreamingPaymentQuery,
    GetStreamingPaymentQueryVariables
  >(GetStreamingPaymentDocument, {
    id: paymentDatabaseId,
  });

  const streamingPayment = response?.data?.getStreamingPayment;

  return streamingPayment;
};
