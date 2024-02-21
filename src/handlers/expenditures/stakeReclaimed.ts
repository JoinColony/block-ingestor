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
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);

  if (expenditure?.stakedTransactionHash) {
    const { ownerAddress, stakedTransactionHash } = expenditure;

    await mutate<UpdateUserStakeMutation, UpdateUserStakeMutationVariables>(
      UpdateUserStakeDocument,
      {
        input: {
          id: getUserStakeDatabaseId(ownerAddress, stakedTransactionHash),
          isClaimed: true,
        },
      },
    );
  }

  verbose(
    `Stake reclaimed for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );
};
