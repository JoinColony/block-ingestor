import { mutate, query } from '~amplifyClient';
import {
  CreateCurrentVersionDocument,
  CreateCurrentVersionMutation,
  CreateCurrentVersionMutationVariables,
  GetCurrentVersionDocument,
  GetCurrentVersionQuery,
  GetCurrentVersionQueryVariables,
  UpdateCurrentVersionDocument,
  UpdateCurrentVersionMutation,
  UpdateCurrentVersionMutationVariables,
} from '~graphql';

/**
 * Util to update current version of an entity (colony, extension, etc.) in the database
 */
export const updateCurrentVersion = async (
  key: string,
  version: number,
): Promise<void> => {
  const response = await query<
    GetCurrentVersionQuery,
    GetCurrentVersionQueryVariables
  >(GetCurrentVersionDocument, {
    key,
  });
  const currentVersion =
    response?.data?.getCurrentVersionByKey?.items[0]?.version;

  if (!currentVersion) {
    // If there is no DB entry for the key, create one
    await mutate<
      CreateCurrentVersionMutation,
      CreateCurrentVersionMutationVariables
    >(CreateCurrentVersionDocument, {
      input: {
        key,
        version,
      },
    });
  } else if (version > currentVersion) {
    // Only update the existing DB entry if new version is greater than the current one
    const databaseId =
      response.data?.getCurrentVersionByKey?.items[0]?.id ?? '';

    await mutate<
      UpdateCurrentVersionMutation,
      UpdateCurrentVersionMutationVariables
    >(UpdateCurrentVersionDocument, {
      input: {
        id: databaseId,
        version,
      },
    });
  }
};
