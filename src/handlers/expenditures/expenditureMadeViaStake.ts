import { mutate } from '~amplifyClient';
import {
  CreateUserStakeDocument,
  CreateUserStakeMutation,
  CreateUserStakeMutationVariables,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';
import { getExpenditureFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  const { expenditureId, stake, creator } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

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

  const stakeDatabaseId = getUserStakeDatabaseId(
    creator,
    event.transactionHash,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        isStaked: true,
        userStakeId: stakeDatabaseId,
      },
    },
  );

  await mutate<CreateUserStakeMutation, CreateUserStakeMutationVariables>(
    CreateUserStakeDocument,
    {
      input: {
        id: stakeDatabaseId,
        actionId: event.transactionHash,
        amount: stake.toString(),
        userAddress: creator,
        colonyAddress,
        isClaimed: false,
      },
    },
  );
};
