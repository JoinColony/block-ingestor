import { BigNumber, utils } from 'ethers';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  UpdateStreamingPaymentDocument,
  UpdateStreamingPaymentMutation,
  UpdateStreamingPaymentMutationVariables,
} from '~graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  checkActionExists,
  getExpenditureDatabaseId,
  mapLogToContractEvent,
  output,
  toNumber,
  verbose,
  writeActionFromEvent,
} from '~utils';
import { getStreamingPaymentFromDB } from './getExpenditure';

export const handleEditOrCancelStreamingPaymentAction = async ({
  event,
  colonyAddress,
  streamingPaymentsInterface,
}: {
  event: ContractEvent;
  colonyAddress: string;
  streamingPaymentsInterface: utils.Interface;
}): Promise<void> => {
  const { transactionHash } = event;

  const actionExists = await checkActionExists(transactionHash);

  if (actionExists) {
    return;
  }

  const { blockNumber, timestamp } = event;
  const { streamingPaymentId } = event.args;

  const convertedExpenditureId = toNumber(streamingPaymentId);
  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const streamingPayment = await getStreamingPaymentFromDB(databaseId);
  if (!streamingPayment) {
    output(
      `Could not find streaming payment with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const logs = await provider.getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [
      [
        utils.id(ContractEventsSignatures.PaymentTokenUpdated),
        utils.id(ContractEventsSignatures.StartTimeSet),
        utils.id(ContractEventsSignatures.EndTimeSet),
      ],
    ],
  });

  const actionEvents = [];
  for (const log of logs) {
    const mappedEvent = await mapLogToContractEvent(
      log,
      streamingPaymentsInterface,
    );
    if (mappedEvent) {
      actionEvents.push(mappedEvent);
    }
  }

  const currentValues = {
    amount: streamingPayment.amount,
    interval: streamingPayment.interval,
    startTime: streamingPayment.startTime,
    endTime: streamingPayment.endTime,
  };

  const newValues = {
    amount: streamingPayment.amount,
    interval: streamingPayment.interval,
    startTime: streamingPayment.startTime,
    endTime: streamingPayment.endTime,
  };

  for (const actionEvent of actionEvents) {
    if (
      actionEvent.signature === ContractEventsSignatures.PaymentTokenUpdated
    ) {
      const { amount, interval } = actionEvent.args;
      if (amount) {
        newValues.amount = amount.toString();
      }
      if (interval) {
        newValues.interval = interval.toString();
      }
    }
    if (actionEvent.signature === ContractEventsSignatures.StartTimeSet) {
      const { startTime } = actionEvent.args;
      if (startTime) {
        newValues.startTime = startTime.toString();
      }
    }
    if (actionEvent.signature === ContractEventsSignatures.EndTimeSet) {
      const { endTime } = actionEvent.args;
      if (endTime) {
        newValues.endTime = endTime.toString();
      }
    }
  }

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      startTime: newValues.startTime,
      endTime: newValues.endTime,
      amount: newValues.amount,
      interval: newValues.interval,
    },
  });

  // When a streaming payment is cancelled, the endTime is set to the current block timestamp
  // Therefore, if the endTime and timestamp are equal, we can assume this is a cancel action
  const isCancelAction = BigNumber.from(timestamp).eq(newValues.endTime);

  const { agent: initiatorAddress } = event.args;

  if (isCancelAction) {
    verbose(`Streaming payment with ID ${databaseId} cancelled`);

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.CancelStreamingPayment,
      initiatorAddress,
      streamingPaymentId: databaseId,
    });
  } else {
    verbose(`Streaming payment with ID ${databaseId} edited`);

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.EditStreamingPayment,
      initiatorAddress,
      streamingPaymentId: databaseId,
      streamingPaymentChanges: {
        oldValues: currentValues,
        newValues,
      },
    });
  }
};
