import { StreamingPaymentsClientV5 } from '@colony/colony-js';
import { utils } from 'ethers';
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
  writeActionFromEvent,
} from '~utils';
import { getStreamingPaymentFromDB } from './getExpenditure';

export const createEditStreamingPaymentAction = async ({
  event,
  colonyAddress,
  streamingPaymentsClient,
}: {
  event: ContractEvent;
  colonyAddress: string;
  streamingPaymentsClient: StreamingPaymentsClientV5;
}): Promise<void> => {
  const { transactionHash } = event;

  const actionExists = await checkActionExists(transactionHash);

  if (actionExists) {
    return;
  }

  const { blockNumber } = event;
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
      streamingPaymentsClient.interface,
    );
    if (mappedEvent) {
      actionEvents.push(mappedEvent);
    }
  }

  const oldValues = {
    amount: streamingPayment.amount,
    interval: streamingPayment.interval,
    startTime: streamingPayment.startTime,
    endTime: streamingPayment.endTime,
  };

  const updatedStreamingPayment: {
    amount?: string;
    interval?: string;
    startTime?: string;
    endTime?: string;
  } = {
    amount: undefined,
    interval: undefined,
    startTime: undefined,
    endTime: undefined,
  };

  for (const actionEvent of actionEvents) {
    if (
      actionEvent.signature === ContractEventsSignatures.PaymentTokenUpdated
    ) {
      const { amount, interval } = actionEvent.args;
      updatedStreamingPayment.amount = amount.toString();
      updatedStreamingPayment.interval = interval.toString();
    }
    if (actionEvent.signature === ContractEventsSignatures.StartTimeSet) {
      const { startTime } = actionEvent.args;
      updatedStreamingPayment.startTime = startTime.toString();
    }
    if (actionEvent.signature === ContractEventsSignatures.EndTimeSet) {
      const { endTime } = actionEvent.args;
      updatedStreamingPayment.endTime = endTime.toString();
    }
  }

  await mutate<
    UpdateStreamingPaymentMutation,
    UpdateStreamingPaymentMutationVariables
  >(UpdateStreamingPaymentDocument, {
    input: {
      id: databaseId,
      startTime: updatedStreamingPayment.startTime,
      endTime: updatedStreamingPayment.endTime,
      amount: updatedStreamingPayment.amount,
      interval: updatedStreamingPayment.interval,
    },
  });

  const { agent: initiatorAddress } = event.args;

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.EditStreamingPayment,
    initiatorAddress,
    streamingPaymentId: databaseId,
    streamingPaymentChanges: {
      oldValues,
      newValues: updatedStreamingPayment,
    },
  });
};
