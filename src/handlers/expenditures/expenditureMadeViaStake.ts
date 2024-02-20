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
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, transactionHash } = event;
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

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        isStaked: true,
      },
    },
  );

  await mutate<CreateUserStakeMutation, CreateUserStakeMutationVariables>(
    CreateUserStakeDocument,
    {
      input: {
        id: getUserStakeDatabaseId(creator, transactionHash),
        actionId: transactionHash,
        amount: stake.toString(),
        userAddress: creator,
        colonyAddress,
        isClaimed: false,
      },
    },
  );
};
