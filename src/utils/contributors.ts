import { query, mutate } from '~amplifyClient';
import {
  CreateColonyContributorDocument,
  CreateColonyContributorMutation,
  CreateColonyContributorMutationVariables,
  GetColonyContributorDocument,
  GetColonyContributorQuery,
  GetColonyContributorQueryVariables,
} from '~graphql';

const getColonyContributorId = (
  colonyAddress: string,
  contributorAddress: string,
): string => {
  return `${colonyAddress}_${contributorAddress}`;
};

export const isAlreadyContributor = async ({
  colonyAddress,
  contributorAddress,
}: {
  colonyAddress: string;
  contributorAddress: string;
}): Promise<boolean> => {
  const { data } =
    (await getColonyContributor({ colonyAddress, contributorAddress })) ?? {};

  return !!data?.getColonyContributor;
};

const getColonyContributor = async ({
  colonyAddress,
  contributorAddress,
}: {
  colonyAddress: string;
  contributorAddress: string;
}): Promise<
  ReturnType<
    typeof query<GetColonyContributorQuery, GetColonyContributorQueryVariables>
  >
> => {
  return await query<
    GetColonyContributorQuery,
    GetColonyContributorQueryVariables
  >(GetColonyContributorDocument, {
    id: getColonyContributorId(colonyAddress, contributorAddress),
  });
};

export const createColonyContributor = async ({
  colonyAddress,
  contributorAddress,
}: {
  colonyAddress: string;
  contributorAddress: string;
}): Promise<void> => {
  await mutate<
    CreateColonyContributorMutation,
    CreateColonyContributorMutationVariables
  >(CreateColonyContributorDocument, {
    input: {
      id: getColonyContributorId(colonyAddress, contributorAddress),
      colonyAddress,
      colonyReputationPercentage: 0,
      contributorAddress,
      verified: false,
    },
  });
};
