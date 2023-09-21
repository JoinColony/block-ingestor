import { mutate } from '~amplifyClient';
import {
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
  ExpenditureStatus,
  ExpenditureType,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';

import { getExpenditure } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: ownerAddress, expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  const expenditure = await getExpenditure(
    colonyAddress,
    convertedExpenditureId,
  );
  if (!expenditure) {
    output(
      `Could not get expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
    );
    return;
  }

  const domainId = toNumber(expenditure.domainId);
  const fundingPotId = toNumber(expenditure.fundingPotId);

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
        type: ExpenditureType.PaymentBuilder,
        colonyId: colonyAddress,
        nativeId: convertedExpenditureId,
        ownerAddress,
        status: ExpenditureStatus.Draft,
        slots: [],
        nativeFundingPotId: fundingPotId,
        nativeDomainId: domainId,
        isStaked: false,
      },
    },
  );
};
