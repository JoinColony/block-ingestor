import { query } from '~amplifyClient';
import {
  ColonyWithRootRolesFragment,
  ListColoniesWithRootPermissionHoldersDocument,
  ListColoniesWithRootPermissionHoldersQuery,
  ListColoniesWithRootPermissionHoldersQueryVariables,
} from '@joincolony/graphql';
import { notNull } from './arrays';
import { getAllPagesOfData, GetDataFn } from './graphql';

const getColoniesData: GetDataFn<
  ColonyWithRootRolesFragment,
  undefined
> = async (_params, nextToken) => {
  const response = await query<
    ListColoniesWithRootPermissionHoldersQuery,
    ListColoniesWithRootPermissionHoldersQueryVariables
  >(ListColoniesWithRootPermissionHoldersDocument, {
    ...(nextToken ? { nextToken } : {}),
  });

  return response?.data?.listColonies;
};

export const getAllColoniesWithRootPermissionHolders = async (): Promise<
  ColonyWithRootRolesFragment[]
> => {
  const allColonies = await getAllPagesOfData(getColoniesData, undefined);

  return allColonies.filter(notNull);
};
