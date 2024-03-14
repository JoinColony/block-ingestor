import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
  ExpenditureStatus,
  ExpenditureType,
} from '~graphql';
import { ContractEvent } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

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

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  await mutate<CreateExpenditureMutation, CreateExpenditureMutationVariables>(
    CreateExpenditureDocument,
    {
      input: {
        id: databaseId,
        type: ExpenditureType.PaymentBuilder,
        colonyId: colonyAddress,
        nativeId: convertedExpenditureId,
        ownerAddress,
        status: ExpenditureStatus.Draft,
        slots: [],
        nativeFundingPotId: fundingPotId,
        nativeDomainId: domainId,
        isStaked: false,
        balances: [],
        transactionHash: event.transactionHash,
      },
    },
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CreateExpenditure,
    initiatorAddress: ownerAddress,
    expenditureId: databaseId,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
  });
};
