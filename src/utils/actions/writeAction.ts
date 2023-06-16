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
import { ColonyActionType, ContractEvent } from '~types';
import { notNull, verbose } from '~utils';
import networkClient from '~networkClient';

type ActionFields = Omit<
  CreateColonyActionInput,
  'blockNumber' | 'colonyId' | 'colonyActionsId' | 'showInActionsList'
>;

export const writeActionFromEvent = async (
  event: ContractEvent,
  colonyAddress: string,
  actionFields: ActionFields,
): Promise<void> => {
  const { transactionHash, blockNumber, timestamp } = event;

  const actionType = actionFields.type ?? 'UNKNOWN';
  const showInActionsList = await showActionInActionsList(
    colonyAddress,
    actionFields,
  );

  verbose('Action', actionType, 'took place in Colony:', colonyAddress);
  await mutate<CreateColonyActionMutation, CreateColonyActionMutationVariables>(
    CreateColonyActionDocument,
    {
      input: {
        id: transactionHash,
        colonyId: colonyAddress,
        blockNumber,
        createdAt: new Date(timestamp * 1000).toISOString(),
        showInActionsList,
        ...actionFields,
      },
    },
  );
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
  actionFields: ActionFields,
): Promise<boolean> => {
  const { initiatorAddress, recipientAddress, type } = actionFields;

  if (type === ColonyActionType.SetUserRoles) {
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

    const isAddressInitiatorOrRecipient = (address: string): boolean =>
      address === initiatorAddress || address === recipientAddress;
    // @NOTE: If the action's initiator or recipient is an extension/network client, then we shouldn't show it in the action list.
    return !(
      extensionAddresses.find(isAddressInitiatorOrRecipient) ??
      isAddressInitiatorOrRecipient(networkClient.address)
    );
  }

  const votingRepIds = await getVotingReputationInstallations(colonyAddress);

  if (!votingRepIds) {
    return true;
  }

  // If the action was created by a motion, don't show it in the list
  return !votingRepIds
    .filter(notNull)
    .some(({ id }) => id === initiatorAddress);
};
