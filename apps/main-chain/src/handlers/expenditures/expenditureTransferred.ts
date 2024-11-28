import { mutate } from '~amplifyClient';
import {
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, owner: newOwnerAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  verbose(
    'Expenditure with ID',
    convertedExpenditureId,
    'transferred to address:',
    newOwnerAddress,
    'in Colony:',
    colonyAddress,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
        ownerAddress: newOwnerAddress,
      },
    },
  );
};
