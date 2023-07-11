import { mutate } from '~amplifyClient';
import {
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: ownerAddress, expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  verbose(
    'Expenditure with ID',
    convertedExpenditureId,
    'added in Colony:',
    colonyAddress,
  );

  await mutate<CreateExpenditureMutation, CreateExpenditureMutationVariables>(
    CreateExpenditureDocument,
    {
      input: {
        colonyId: colonyAddress,
        ownerAddress,
      },
    },
  );
};
