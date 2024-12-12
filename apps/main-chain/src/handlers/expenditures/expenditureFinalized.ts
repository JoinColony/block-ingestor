import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureStatus,
  NotificationType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent, ContractEventsSignatures } from '@joincolony/blocks';
import {
  getExpenditureDatabaseId,
  toNumber,
  transactionHasEvent,
  writeActionFromEvent,
} from '~utils';
import { sendExpenditureUpdateNotifications } from '~utils/notifications';
import { verbose } from '@joincolony/utils';

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

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      status: ExpenditureStatus.Finalized,
      finalizedAt: event.timestamp,
    },
  });

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
