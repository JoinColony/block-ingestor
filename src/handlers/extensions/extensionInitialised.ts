import { Extension, getExtensionHash } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import {
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import {
  verbose,
  addVotingReputationParamsToDB,
  addStakedExpenditureParamsToDB,
} from '~utils';
import {
  setupListenersForStakedExpenditure,
  setupMotionsListeners,
} from '~eventListeners';

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

  if (!colonyAddress) {
    return;
  }

  if (getExtensionHash(Extension.VotingReputation) === extensionHash) {
    /* Listen for motions once Voting Reputation is enabled. */
    setupMotionsListeners(extensionAddress, colonyAddress);
    await addVotingReputationParamsToDB(extensionAddress, colonyAddress);
  } else if (getExtensionHash(Extension.StakedExpenditure) === extensionHash) {
    setupListenersForStakedExpenditure(extensionAddress, colonyAddress, true);
    await addStakedExpenditureParamsToDB(extensionAddress, colonyAddress);
  }
};
