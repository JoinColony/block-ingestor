import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
  ExpenditureStatus,
  ExpenditureType,
} from '~graphql';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  transactionHasEvent,
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  output,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';

import { getExpenditure } from './helpers';
import {
  NotificationType,
  sendExpenditureUpdateNotifications,
} from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
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
      },
    },
  );

  /**
   * @NOTE: Only create a `CREATE_EXPENDITURE` action if the expenditure was not created as part of a OneTxPayment
   */
  const hasOneTxPaymentEvent = await transactionHasEvent(
    transactionHash,
    ContractEventsSignatures.OneTxPaymentMade,
  );

  if (!hasOneTxPaymentEvent) {
    await writeActionFromEvent(event, colonyAddress, {
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
  }
};
