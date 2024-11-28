import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';

import { getExpenditureFromDB, getUpdatedExpenditureSlots } from './helpers';
import { sendMentionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, recipient: recipientAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const updatedSlots = getUpdatedExpenditureSlots(
    expenditure.slots,
    convertedSlot,
    {
      recipientAddress,
    },
  );

  verbose(
    `Recipient set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
      },
    },
  );

  const mentionRecipients: string[] = [];
  updatedSlots.forEach((updatedSlot) => {
    if (!updatedSlot.recipientAddress) {
      return;
    }

    // Only send a mention if this recipient is a newly added recipient.
    const recipientAlreadyExisted = !!expenditure.slots.find(
      (slot) => slot.recipientAddress === updatedSlot.recipientAddress,
    );
    if (!recipientAlreadyExisted) {
      mentionRecipients.push(updatedSlot.recipientAddress);
    }
  });

  const expenditureCreatedAction = expenditure.actions?.items.find(
    (action) => action?.type === ColonyActionType.CreateExpenditure,
  );

  if (mentionRecipients.length && expenditureCreatedAction) {
    sendMentionNotifications({
      colonyAddress,
      creator: expenditure.ownerAddress,
      recipients: mentionRecipients,
      expenditureID: expenditure.id,
      transactionHash: expenditureCreatedAction.id,
    });
  }
};
