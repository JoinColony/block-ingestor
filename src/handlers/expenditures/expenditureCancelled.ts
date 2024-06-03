import { EventHandler } from '~types';
import {
  getExpenditureDatabaseId,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { EventListenerType } from '~eventListeners';

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

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        status: ExpenditureStatus.Cancelled,
      },
    },
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.CancelExpenditure,
    initiatorAddress,
    expenditureId: databaseId,
  });
};
