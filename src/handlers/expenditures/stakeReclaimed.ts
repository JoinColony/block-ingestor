import { mutate } from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;
  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  if (!colonyAddress) {
    return;
  }

  verbose(
    `Stake reclaimed for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

  mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
        hasReclaimedStake: true,
      },
    },
  );
};
