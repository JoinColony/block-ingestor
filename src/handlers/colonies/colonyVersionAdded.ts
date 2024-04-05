import { mutate, query } from '~amplifyClient';
import { COLONY_CURRENT_VERSION_KEY } from '~constants';
import {
  GetCurrentColonyVersionDocument,
  GetCurrentColonyVersionQuery,
  GetCurrentColonyVersionQueryVariables,
  SetCurrentVersionDocument,
  SetCurrentVersionMutation,
  SetCurrentVersionMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { version } = event.args;
  const convertedVersion = toNumber(version);

  verbose('New colony version:', convertedVersion, 'added to network');

  const response = await query<
    GetCurrentColonyVersionQuery,
    GetCurrentColonyVersionQueryVariables
  >(GetCurrentColonyVersionDocument);
  const currentVersion =
    response?.data?.getCurrentVersionByKey?.items[0]?.version ?? 1;

  // Only update the version in DB if the new version is greater than the current version
  if (convertedVersion > currentVersion) {
    await mutate<SetCurrentVersionMutation, SetCurrentVersionMutationVariables>(
      SetCurrentVersionDocument,
      {
        input: {
          key: COLONY_CURRENT_VERSION_KEY,
          version: convertedVersion,
        },
      },
    );
  }
};
