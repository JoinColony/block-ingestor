import { mutate } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
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
} from '~graphql';
import { EventHandler } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';
import { getExpenditureFromDB } from './helpers';
import { getBlockChainTimestampISODate } from '../../utils/dates';

export const handleExpenditureMadeViaStake: EventHandler = async (
  event,
  listener,
) => {
  const { transactionHash, contractAddress, timestamp } = event;
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

  const currentBlockChainTime = getBlockChainTimestampISODate(timestamp);

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        isStaked: true,
        userStakeId: stakeDatabaseId,
        stakedExpenditureAddress: contractAddress,
      },
    },
  );

  await mutate<CreateUserStakeMutation, CreateUserStakeMutationVariables>(
    CreateUserStakeDocument,
    {
      input: {
        id: stakeDatabaseId,
        actionId: transactionHash,
        amount: stake.toString(),
        userAddress: creator,
        colonyAddress,
        isClaimed: false,
        type: UserStakeType.StakedExpenditure,
        createdAt: currentBlockChainTime,
      },
    },
  );

  await mutate<UpdateColonyActionMutation, UpdateColonyActionMutationVariables>(
    UpdateColonyActionDocument,
    {
      input: {
        id: transactionHash,
        showInActionsList: true,
        initiatorAddress: creator,
      },
    },
  );
};
