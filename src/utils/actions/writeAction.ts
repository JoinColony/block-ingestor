import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
} from '~graphql';
import { toNumber, verbose, getExtensionInstallations } from '~utils';
import { ContractEvent } from '~types';
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
    event,
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
  { args }: ContractEvent,
  colonyAddress: string,
  { type, initiatorAddress, recipientAddress }: ActionFields,
): Promise<boolean> => {
  if (type === ColonyActionType.MoveFunds) {
    const [, , toPot] = args;

    const { data } =
      (await query<
        GetExpenditureByNativeFundingPotIdAndColonyQuery,
        GetExpenditureByNativeFundingPotIdAndColonyQueryVariables
      >(GetExpenditureByNativeFundingPotIdAndColonyDocument, {
        nativeFundingPotId: toNumber(toPot),
        colonyAddress,
      })) ?? {};

    // if there's an expenditure in the db with this funding pot id, it means we're funding an expenditure
    const isFundingExpenditure =
      !!data?.getExpendituresByNativeFundingPotIdAndColony?.items.length;

    // if we're funding an expenditure, we don't want to show it in the action list
    // else, we still want to check if the action's initiator or recipient is an extension/network client
    if (isFundingExpenditure) {
      return false;
    }
  }

  const extensionAddresses = await getExtensionInstallations(colonyAddress);

  const isAddressInitiatorOrRecipient = (address: string): boolean =>
    address === initiatorAddress || address === recipientAddress;
  // @NOTE: If the action's initiator or recipient is an extension/network client, then we shouldn't show it in the action list.
  return !(
    extensionAddresses.find(isAddressInitiatorOrRecipient) ??
    isAddressInitiatorOrRecipient(networkClient.address)
  );
};
