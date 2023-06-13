import dotenv from 'dotenv';

import networkClient from '~networkClient';
import { toNumber } from '~utils';
import { mutate } from '~amplifyClient';
import { COLONY_CURRENT_VERSION_KEY } from '~constants';
import {
  SetCurrentVersionDocument,
  SetCurrentVersionMutation,
  SetCurrentVersionMutationVariables,
} from '~graphql';

dotenv.config();

export const coloniesSet = new Set<string>();

export default async (): Promise<void> => {
  await writeCurrentNetworkColonyVersion();
};

/*
 * Function writing the highest colony version currently available in the network to the database
 * Subsequent changes to available version are handled in eventProcessor
 */
const writeCurrentNetworkColonyVersion = async (): Promise<void> => {
  const version = await networkClient.getCurrentColonyVersion();

  await mutate<SetCurrentVersionMutation, SetCurrentVersionMutationVariables>(
    SetCurrentVersionDocument,
    {
      input: {
        key: COLONY_CURRENT_VERSION_KEY,
        version: toNumber(version),
      },
    },
  );
};
