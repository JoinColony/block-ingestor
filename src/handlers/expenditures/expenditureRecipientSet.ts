import { mutate } from '~amplifyClient';
import {
  ExpenditureRecipient,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import { getExpenditure } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, recipient: recipientAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditure(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${convertedExpenditureId} and colony address: ${colonyAddress} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  const recipient: ExpenditureRecipient = {
    slot: convertedSlot,
    address: recipientAddress,
  };
  const updatedRecipients = [
    ...expenditure.recipients.filter(
      (recipient) => recipient.slot !== convertedSlot,
    ),
    recipient,
  ];

  verbose(
    `Recipient set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        recipients: updatedRecipients,
      },
    },
  );
};
