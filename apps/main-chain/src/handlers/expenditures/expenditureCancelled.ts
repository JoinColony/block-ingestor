import {
  getExpenditureDatabaseId,
  toNumber,
  writeActionFromEvent,
} from '~utils';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureStatus,
  NotificationType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { EventListenerType, EventHandler } from '@joincolony/blocks';
import { sendExpenditureUpdateNotifications } from '~utils/notifications';
import { verbose } from '@joincolony/utils';

export const handleExpenditureCancelled: EventHandler = async (
  event,
  listener,
) => {
  const { expenditureId, agent: initiatorAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  /**
   * @NOTE: This event can be emitted by either colony or StakedExpenditure extension
   * Depending on that, the colony address can be accessed from the listener or the event
   */
  const colonyAddress =
    listener.type === EventListenerType.Extension
      ? listener.colonyAddress
      : event.contractAddress;

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  verbose(
    'Expenditure with ID',
    databaseId,
    'cancelled in Colony:',
    colonyAddress,
  );

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      status: ExpenditureStatus.Cancelled,
    },
  });

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CancelExpenditure,
    initiatorAddress,
    expenditureId: databaseId,
  });

  sendExpenditureUpdateNotifications({
    colonyAddress,
    creator: initiatorAddress,
    notificationType: NotificationType.ExpenditureCancelled,
    expenditureID: databaseId,
  });
};
