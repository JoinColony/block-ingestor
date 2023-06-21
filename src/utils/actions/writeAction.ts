import { mutate, query } from '~amplifyClient';
import {
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
  GetColonyExtensionsByColonyAddressDocument,
  GetColonyExtensionsByColonyAddressQuery,
  GetColonyExtensionsByColonyAddressQueryVariables,
} from '~graphql';
import { ContractEvent } from '~types';
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

const showActionInActionsList = async (
  colonyAddress: string,
  actionFields: ActionFields,
): Promise<boolean> => {
  const { initiatorAddress, recipientAddress } = actionFields;

  const { data } =
    (await query<
      GetColonyExtensionsByColonyAddressQuery,
      GetColonyExtensionsByColonyAddressQueryVariables
    >(GetColonyExtensionsByColonyAddressDocument, {
      colonyAddress,
    })) ?? {};
  const extensionAddresses =
    data?.getExtensionByColonyAndHash?.items
      .filter(notNull)
      .map((colonyExtension) => colonyExtension.id) ?? [];

  const isAddressInitiatorOrRecipient = (address: string): boolean =>
    address === initiatorAddress || address === recipientAddress;
  // @NOTE: If the action's initiator or recipient is an extension/network client, then we shouldn't show it in the action list.
  return !(
    extensionAddresses.find(isAddressInitiatorOrRecipient) ??
    isAddressInitiatorOrRecipient(networkClient.address)
  );
};
