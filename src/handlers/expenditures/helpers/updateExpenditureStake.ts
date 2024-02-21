import { mutate } from '~amplifyClient';
import {
  UpdateUserStakeDocument,
  UpdateUserStakeMutation,
  UpdateUserStakeMutationVariables,
  UpdateUserStakeInput,
} from '~graphql';
import { getUserStakeDatabaseId } from '~utils/stakes';
import { getExpenditureFromDB } from './getExpenditure';
import { output, verbose } from '~utils';

export const updateExpenditureStake = async (
  expenditureDatabaseId: string,
  fieldsToUpdate: Pick<UpdateUserStakeInput, 'isClaimed' | 'isForfeited'>,
): Promise<void> => {
  const expenditure = await getExpenditureFromDB(expenditureDatabaseId);
  if (!expenditure) {
    output(
      `Expenditure with ID ${expenditureDatabaseId} not found when updating stake`,
    );
    return;
  }

  if (!expenditure.stakedTransactionHash) {
    output(
      `Expenditure with ID ${expenditureDatabaseId} does not have a staked transaction hash`,
    );
    return;
  }

  const stakeDatabaseId = getUserStakeDatabaseId(
    expenditure.ownerAddress,
    expenditure.stakedTransactionHash,
  );

  await mutate<UpdateUserStakeMutation, UpdateUserStakeMutationVariables>(
    UpdateUserStakeDocument,
    {
      input: {
        id: stakeDatabaseId,
        ...fieldsToUpdate,
      },
    },
  );

  verbose(
    `Updated stake with ID ${stakeDatabaseId} for expenditure ${expenditureDatabaseId}`,
  );
};
