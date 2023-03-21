import { Extension, getExtensionHash } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import {
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { verbose } from '~utils';
import { motionSpecificEventsListener } from '~eventListener';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = event;

  verbose('Extension with address:', extensionAddress, 'was enabled');

  const mutationResult = await mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      isInitialized: true,
    },
  });

  const extensionHash =
    mutationResult?.data?.updateColonyExtension?.extensionHash;
  const colonyAddress =
    mutationResult?.data?.updateColonyExtension?.colonyAddress;

  /* Listen for motions once Voting Reputation is enabled. */
  if (getExtensionHash(Extension.VotingReputation) === extensionHash) {
    await motionSpecificEventsListener(colonyAddress);
  }
};
