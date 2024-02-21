import { mutate } from '~amplifyClient';
import {
  UpdateUserStakeDocument,
  UpdateUserStakeMutation,
  UpdateUserStakeMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';
import { getUserStakeDatabaseId } from '~utils/stakes';

import { getExpenditureFromDB } from './helpers';

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

  const expenditure = await getExpenditureFromDB(databaseId);

  if (expenditure?.stakedTransactionHash) {
    const { ownerAddress, stakedTransactionHash } = expenditure;

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
