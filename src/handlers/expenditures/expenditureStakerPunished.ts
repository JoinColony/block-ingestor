import { mutate } from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
  UpdateUserStakeDocument,
  UpdateUserStakeMutation,
  UpdateUserStakeMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  const { expenditureId, punished } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    `Staker of expenditure with ID ${databaseId} was ${
      !punished ? 'not ' : ''
    }punished`,
  );

  const updateExpenditureResponse = await mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      isStakeForfeited: punished,
    },
  });
  const expenditureDetails = updateExpenditureResponse?.data?.updateExpenditure;

  if (expenditureDetails?.stakedTransactionHash) {
    const { ownerAddress, stakedTransactionHash } = expenditureDetails;

    await mutate<UpdateUserStakeMutation, UpdateUserStakeMutationVariables>(
      UpdateUserStakeDocument,
      {
        input: {
          id: getUserStakeDatabaseId(ownerAddress, stakedTransactionHash),
          isForfeited: punished,
        },
      },
    );
  }
};
