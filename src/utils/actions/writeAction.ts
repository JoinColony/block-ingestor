import { mutate, query } from '~amplifyClient';
import {
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { Extension, getExtensionHash } from '@colony/colony-js';
import { verbose } from '~utils';

export const writeActionFromEvent = async (
  event: ContractEvent,
  colonyAddress: string,
  actionFields: Omit<
    CreateColonyActionInput,
    'blockNumber' | 'colonyId' | 'colonyActionsId'
  >,
): Promise<void> => {
  const { transactionHash, blockNumber, timestamp } = event;

  const actionType = actionFields.type ?? 'UNKNOWN';
  const showInActionsList = await showActionInActionsList(
    colonyAddress,
    actionFields.initiatorAddress ?? '',
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
): Promise<Array<{ id: string }> | undefined> => {
  const votingRepHash = getExtensionHash(Extension.VotingReputation);
  const { items } =
    (await query<{ items: Array<{ id: string }> }>(
      GetVotingRepInstallationsQueryDocument,
      {
        votingRepHash,
        colonyAddress,
      },
    )) ?? {};

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
  return !votingRepIds.some(({ id }) => id === initiatorAddress);
};
