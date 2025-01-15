import { Extension, getExtensionHash } from '@colony/colony-js';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  CreateColonyActionDocument,
  CreateColonyActionInput,
  CreateColonyActionMutation,
  CreateColonyActionMutationVariables,
  ExtensionFragment,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
  UpdateColonyMotionDocument,
  UpdateColonyMotionMutation,
  UpdateColonyMotionMutationVariables,
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigMutation,
  UpdateColonyMultiSigMutationVariables,
} from '@joincolony/graphql';
import { toNumber, getColonyExtensions } from '~utils';
import { ContractEvent } from '@joincolony/blocks';
import networkClient from '~networkClient';
import { getBlockChainTimestampISODate } from '~utils/dates';
import { verbose } from '@joincolony/utils';
import { getFinalizationMotionId, getFinalizationMultiSigId } from './motions';
import { getMotionFromDB } from '~handlers/motions/helpers';
import { getMultiSigFromDB } from '~handlers/multiSig/helpers';

export type ActionFields = Omit<
  CreateColonyActionInput,
  | 'blockNumber'
  | 'colonyId'
  | 'colonyActionsId'
  | 'showInActionsList'
  | 'rootHash'
>;

export const writeActionFromEvent = async (
  event: ContractEvent,
  colonyAddress: string,
  actionFields: ActionFields,
): Promise<void> => {
  const { transactionHash, blockNumber, timestamp } = event;

  const actionType = actionFields.type;

  const colonyExtensions = await getColonyExtensions(colonyAddress);

  const isMotionFinalization = await isActionMotionFinalization(
    actionFields.initiatorAddress,
    colonyExtensions,
  );

  const isMultiSigFinalization = await isActionMultiSigFinalization(
    actionFields.initiatorAddress,
    colonyExtensions,
  );

  let finalizedActionId = null;

  if (isMotionFinalization) {
    const motionDatabaseId = await getFinalizationMotionId(
      transactionHash,
      actionFields.initiatorAddress,
    );

    if (motionDatabaseId) {
      const finalizedMotion = await getMotionFromDB(motionDatabaseId);
      finalizedActionId = finalizedMotion?.transactionHash;

      await amplifyClient.mutate<
        UpdateColonyMotionMutation,
        UpdateColonyMotionMutationVariables
      >(UpdateColonyMotionDocument, {
        input: {
          id: motionDatabaseId,
          finalizationActionId: transactionHash,
        },
      });
    }
  }

  if (isMultiSigFinalization) {
    const multisigDatabaseId = await getFinalizationMultiSigId(
      transactionHash,
      actionFields.initiatorAddress,
    );

    if (multisigDatabaseId) {
      const finalizedMultiSig = await getMultiSigFromDB(multisigDatabaseId);
      finalizedActionId = finalizedMultiSig?.transactionHash;

      await amplifyClient.mutate<
        UpdateColonyMultiSigMutation,
        UpdateColonyMultiSigMutationVariables
      >(UpdateColonyMultiSigDocument, {
        input: {
          id: multisigDatabaseId,
          finalizationActionId: transactionHash,
        },
      });
    }
  }

  const showInActionsList = await showActionInActionsList(
    event,
    colonyAddress,
    actionFields,
    colonyExtensions,
  );

  const rootHash = await networkClient.getReputationRootHash({
    blockTag: blockNumber,
  });

  verbose('Action', actionType, 'took place in Colony:', colonyAddress);

  await amplifyClient.mutate<
    CreateColonyActionMutation,
    CreateColonyActionMutationVariables
  >(CreateColonyActionDocument, {
    input: {
      id: transactionHash,
      colonyId: colonyAddress,
      blockNumber,
      createdAt: getBlockChainTimestampISODate(timestamp),
      showInActionsList,
      rootHash,
      isMotionFinalization: isMotionFinalization || isMultiSigFinalization,
      finalizedActionId,
      ...actionFields,
    },
  });
};

const showActionInActionsList = async (
  { args }: ContractEvent,
  colonyAddress: string,
  { type, initiatorAddress, recipientAddress }: ActionFields,
  colonyExtensions: ExtensionFragment[],
): Promise<boolean> => {
  if (type === ColonyActionType.MoveFunds) {
    const [, , toPot] = args;

    const { data } =
      (await amplifyClient.query<
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

  // By default, don't show create expenditure actions in the action list.
  // Once the saga completes successfully in the CDapp, it will change the showInActionList to true.
  // This stops half formed expenditures from showing.
  if (type === ColonyActionType.CreateExpenditure) {
    return false;
  }

  const extensionAddresses = colonyExtensions.map((extension) => extension.id);

  const isAddressInitiatorOrRecipient = (address: string): boolean =>
    address === initiatorAddress || address === recipientAddress;

  // @NOTE: If the action's initiator or recipient is an extension/network client or the colony itself, then we shouldn't show it in the action list.
  return !(
    !!extensionAddresses.find(isAddressInitiatorOrRecipient) ||
    isAddressInitiatorOrRecipient(networkClient.address) ||
    colonyAddress === initiatorAddress
  );
};

/**
 * Determines whether the action is a result of a motion being finalized
 * by checking if its initiator was the Voting Reputation extension
 * or the Multi-sig extension
 */
const isActionMotionFinalization = async (
  initiatorAddress: string,
  extensions: ExtensionFragment[],
): Promise<boolean> => {
  const initiatorExtension = extensions.find(
    (extension) => extension.id === initiatorAddress,
  );

  return (
    !!initiatorExtension &&
    (initiatorExtension.hash === getExtensionHash(Extension.VotingReputation) ||
      initiatorExtension.hash ===
        getExtensionHash(Extension.MultisigPermissions))
  );
};
/**
 * Determines whether the action is a result of a multisig being finalized
 * by checking if its initiator was the MultiSig extension
 */
const isActionMultiSigFinalization = async (
  initiatorAddress: string,
  extensions: ExtensionFragment[],
): Promise<boolean> => {
  const initiatorExtension = extensions.find(
    (extension) => extension.id === initiatorAddress,
  );

  return (
    !!initiatorExtension &&
    initiatorExtension.hash === getExtensionHash(Extension.MultisigPermissions)
  );
};

export const createColonyAction = async (
  actionData: CreateColonyActionInput,
  blockTimestamp: number,
): Promise<void> => {
  await amplifyClient.mutate<
    CreateColonyActionMutation,
    CreateColonyActionMutationVariables
  >(CreateColonyActionDocument, {
    input: {
      ...actionData,
      createdAt: getBlockChainTimestampISODate(blockTimestamp),
    },
  });
};
