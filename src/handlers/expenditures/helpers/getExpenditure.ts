import { query } from '~amplifyClient';
import {
  GetExpenditureDocument,
  GetExpenditureQuery,
  GetExpenditureQueryVariables,
} from '~graphql';

export const getExpenditure = async (
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
