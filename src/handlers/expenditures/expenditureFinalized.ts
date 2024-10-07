import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getExpenditureDatabaseId,
  toNumber,
  transactionHasEvent,
  verbose,
  writeActionFromEvent,
} from '~utils';
import {
  NotificationType,
  sendExpenditureUpdateNotifications,
} from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, agent: initiatorAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    'Expenditure with ID',
    databaseId,
    'finalized in Colony:',
    colonyAddress,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        status: ExpenditureStatus.Finalized,
        finalizedAt: event.timestamp,
      },
    },
  );

  /**
   * @NOTE: Only create a `FINALIZE_EXPENDITURE` action if the expenditure was not created as part of a OneTxPayment
   */
  const hasOneTxPaymentEvent = await transactionHasEvent(
    event.transactionHash,
    ContractEventsSignatures.OneTxPaymentMade,
  );

  if (!hasOneTxPaymentEvent) {
    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.FinalizeExpenditure,
      initiatorAddress,
      expenditureId: databaseId,
    });

    sendExpenditureUpdateNotifications({
      colonyAddress,
      creator: initiatorAddress,
      notificationType: NotificationType.ExpenditureFinalized,
      expenditureID: databaseId,
    });
  }
};
