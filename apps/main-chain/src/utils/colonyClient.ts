import amplifyClient from '~amplifyClient';
import {
  Colony,
  GetColonyDocument,
  GetColonyQuery,
  GetColonyQueryVariables,
} from '@joincolony/graphql';
import { output } from '@joincolony/utils';

// @TODO: Consider refactoring this as it doesn't feel like it's in the right place
export const getColonyFromDB = async (
  colonyAddress: string,
): Promise<Colony | undefined> => {
  const { data } =
    (await amplifyClient.query<GetColonyQuery, GetColonyQueryVariables>(
      GetColonyDocument,
      {
        id: colonyAddress,
      },
    )) ?? {};

  const colony = data?.getColony;

  if (!colony) {
    output(
      `Could not find colony: ${colonyAddress} in database. This is a bug and should be investigated.`,
    );
    return;
  }

  return colony;
};
