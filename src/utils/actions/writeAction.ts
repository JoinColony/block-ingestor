import { Extension, getExtensionHash } from '@colony/colony-js';

import { mutate, query } from '~amplifyClient';
import {
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
  GetColonyExtensionsByColonyAddressDocument,
  GetColonyExtensionsByColonyAddressQuery,
  GetColonyExtensionsByColonyAddressQueryVariables,
  GetVotingRepInstallationsDocument,
  GetVotingRepInstallationsQuery,
  GetVotingRepInstallationsQueryVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { notNull, verbose } from '~utils';

type ActionFields = Omit<
  CreateColonyActionInput,
  'blockNumber' | 'colonyId' | 'colonyActionsId' | 'showInActionsList'
>;

export const writeActionFromEvent = async (
  event: ContractEvent,
  colonyAddress: string,
  actionFields: ActionFields,
): Promise<void> => {
  const { data } =
    (await query<
      GetColonyExtensionsByColonyAddressQuery,
      GetColonyExtensionsByColonyAddressQueryVariables
    >(GetColonyExtensionsByColonyAddressDocument, {
      colonyAddress,
    })) ?? {};
  const extensionAddresses =
    data?.listColonyExtensions?.items
      .filter(notNull)
      .map((colonyExtension) => colonyExtension.id) ?? [];

  if (
    !extensionAddresses.find(
      (extensionAddress) =>
        extensionAddress === actionFields.initiatorAddress ||
        extensionAddress === actionFields.recipientAddress,
    )
  ) {
    const { transactionHash, blockNumber, timestamp } = event;

    const actionType = actionFields.type ?? 'UNKNOWN';
    const showInActionsList = await showActionInActionsList(
      colonyAddress,
      actionFields.initiatorAddress ?? '',
    );

    verbose('Action', actionType, 'took place in Colony:', colonyAddress);
    await mutate<
      CreateColonyActionMutation,
      CreateColonyActionMutationVariables
    >(CreateColonyActionDocument, {
      input: {
        id: transactionHash,
        colonyId: colonyAddress,
        blockNumber,
        createdAt: new Date(timestamp * 1000).toISOString(),
        showInActionsList,
        ...actionFields,
      },
    });
  }
};

const getVotingReputationInstallations = async (
  colonyAddress: string,
): Promise<
  Array<{ __typename?: 'ColonyExtension'; id: string } | null> | undefined
> => {
  const votingRepHash = getExtensionHash(Extension.VotingReputation);
  const { data } =
    (await query<
      GetVotingRepInstallationsQuery,
      GetVotingRepInstallationsQueryVariables
    >(GetVotingRepInstallationsDocument, {
      votingRepHash,
      colonyAddress,
    })) ?? {};

  const items = data?.getExtensionByColonyAndHash?.items;

  return items;
};

const showActionInActionsList = async (
  colonyAddress: string,
  initiatorAddress: string,
): Promise<boolean> => {
  const votingRepIds = await getVotingReputationInstallations(colonyAddress);

  if (!votingRepIds) {
    return true;
  }

  // If the action was created by a motion, don't show it in the list
  return !votingRepIds
    .filter(notNull)
    .some(({ id }) => id === initiatorAddress);
};
