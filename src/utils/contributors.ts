import { query, mutate } from '~amplifyClient';
import {
  CreateColonyContributorDocument,
  CreateColonyContributorMutation,
  CreateColonyContributorMutationVariables,
  GetAllColonyRolesDocument,
  GetAllColonyRolesQuery,
  GetAllColonyRolesQueryVariables,
  GetColonyContributorDocument,
  GetColonyContributorQuery,
  GetColonyContributorQueryVariables,
  UpdateColonyContributorDocument,
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
} from '~graphql';
import { notNull } from './arrays';

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
      isVerified: false,
      hasPermissions: true, // if this is the first time a contributor is being created, it's because permissions are being given
    },
  });
};

export const updateColonyContributor = async ({
  colonyAddress,
  contributorAddress,
}: {
  colonyAddress: string;
  contributorAddress: string;
}): Promise<void> => {
  const { data } =
    (await query<GetAllColonyRolesQuery, GetAllColonyRolesQueryVariables>(
      GetAllColonyRolesDocument,
      {
        colonyAddress,
        targetAddress: contributorAddress,
      },
    )) ?? {};

  // Is there at least one role for which user has at least one permission?
  const hasAtLeastOnePermissionInColony =
    !!data?.getRoleByTargetAddressAndColony?.items
      .filter(notNull)
      .some((roles) =>
        Object.keys(roles).some(
          (role) =>
            // @ts-expect-error
            role.startsWith('role_') && !!roles[role],
        ),
      );

  await mutate<
    UpdateColonyContributorMutation,
    UpdateColonyContributorMutationVariables
  >(UpdateColonyContributorDocument, {
    input: {
      id: getColonyContributorId(colonyAddress, contributorAddress),
      hasPermissions: hasAtLeastOnePermissionInColony,
    },
  });
};
