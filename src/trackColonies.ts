import dotenv from 'dotenv';

import networkClient from '~networkClient';
import { addNetworkEventListener, toNumber } from '~utils';
import { ContractEventsSignatures } from '~types';
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
  /*
   * Set a Network level listener to track new colonies that will get created on chain
   */
  await addNetworkEventListener(ContractEventsSignatures.ColonyAdded);

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
