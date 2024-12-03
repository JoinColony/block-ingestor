import amplifyClient from '~amplifyClient';
import {
  CreateUserStakeDocument,
  CreateUserStakeMutation,
  CreateUserStakeMutationVariables,
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
  UserStakeType,
} from '@joincolony/graphql';
import { getExpenditureDatabaseId, toNumber } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';
import { getExpenditureFromDB } from './helpers';
import { output, verbose } from '@joincolony/utils';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';

export const handleExpenditureMadeViaStake: EventHandler = async (
  event,
  listener,
) => {
  const { transactionHash, contractAddress } = event;
  const { expenditureId, stake, creator } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const { colonyAddress } = listener as ExtensionEventListener;

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(`Expenditure with ID ${databaseId} made via stake`);

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(`Expenditure with ID ${databaseId} was not found in the DB`);
    return;
  }

  const stakeDatabaseId = getUserStakeDatabaseId(creator, transactionHash);

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      isStaked: true,
      userStakeId: stakeDatabaseId,
      stakedExpenditureAddress: contractAddress,
    },
  });

  await amplifyClient.mutate<
    CreateUserStakeMutation,
    CreateUserStakeMutationVariables
  >(CreateUserStakeDocument, {
    input: {
      id: stakeDatabaseId,
      actionId: transactionHash,
      amount: stake.toString(),
      userAddress: creator,
      colonyAddress,
      isClaimed: false,
      type: UserStakeType.StakedExpenditure,
    },
  });

  await amplifyClient.mutate<
    UpdateColonyActionMutation,
    UpdateColonyActionMutationVariables
  >(UpdateColonyActionDocument, {
    input: {
      id: transactionHash,
      showInActionsList: true,
      initiatorAddress: creator,
    },
  });
};
