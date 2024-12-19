import { ActionHandler } from '~actions/types';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
  ExpenditureStatus,
  ExpenditureType,
  NotificationType,
} from '~graphql';
// @TODO: Move closer to the handler
import { getExpenditure } from '~handlers/expenditures/helpers';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

import { sendExpenditureUpdateNotifications } from '~utils/notifications';

export const handleExpenditureAddedAction: ActionHandler = async (events) => {
  const { contractAddress: colonyAddress, transactionHash } = events[0];
  const { agent: ownerAddress, expenditureId } = events[0].args;
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
      },
    },
  );

  await writeActionFromEvent(events[0], colonyAddress, {
    type: ColonyActionType.CreateExpenditure,
    initiatorAddress: ownerAddress,
    expenditureId: databaseId,
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
  });

  sendExpenditureUpdateNotifications({
    colonyAddress,
    creator: ownerAddress,
    notificationType: NotificationType.ExpenditureReadyForReview,
    transactionHash,
    expenditureID: databaseId,
  });
};
