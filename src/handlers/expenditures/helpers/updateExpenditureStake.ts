import { mutate } from '~amplifyClient';
import {
  UpdateUserStakeDocument,
  UpdateUserStakeMutation,
  UpdateUserStakeMutationVariables,
  UpdateUserStakeInput,
} from '~graphql';
import { getExpenditureFromDB } from './getExpenditure';
import { output, verbose } from '~utils';

export const updateExpenditureStake = async (
  expenditureDatabaseId: string,
  fieldsToUpdate: Pick<UpdateUserStakeInput, 'isClaimed' | 'isForfeited'>,
): Promise<void> => {
  const expenditure = await getExpenditureFromDB(expenditureDatabaseId);

  if (!expenditure || !expenditure.userStakeId) {
    output(
      `Could not get user stake ID for expenditure with ID ${expenditureDatabaseId}`,
    );
    return;
  }

  await mutate<UpdateUserStakeMutation, UpdateUserStakeMutationVariables>(
    UpdateUserStakeDocument,
    {
      input: {
        id: expenditure.userStakeId,
        ...fieldsToUpdate,
      },
    },
  );

  verbose(
    `Updated stake with ID ${expenditure.userStakeId} for expenditure ${expenditureDatabaseId}`,
  );
};
