import { mutate } from '~amplifyClient';
import {
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
  ExpenditureStatus,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, toNumber, verbose } from '~utils';

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
        id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
        colonyId: colonyAddress,
        nativeId: convertedExpenditureId,
        ownerAddress,
        status: ExpenditureStatus.Draft,
        slots: [],
      },
    },
  );
};
