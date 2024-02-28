import { ethers } from 'ethers';
import { ContractEvent } from '~types';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  output,
  toNumber,
} from '~utils';
import {
  ExpenditureSlot,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import { getExpenditureFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { storageSlot, expenditureId, value } = event.args;
  // The unfortunate naming of the `keys` property means we have to access it like so
  const keys = event.args[4];
  const convertedStorageSlot = toNumber(storageSlot);
  const convertedExpenditureId = toNumber(expenditureId);

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db when handling ExpenditureStateChanged event`,
    );
    return;
  }

  let updatedSlots: ExpenditureSlot[] | undefined;

  if (convertedStorageSlot === 26) {
    const expenditureSlotId = toNumber(keys[0]);
    const recipientAddress = ethers.utils.defaultAbiCoder
      .decode(['address'], value)
      .toString();

    const existingSlot = expenditure.slots.find(
      (slot) => slot.id === expenditureSlotId,
    );
    const updatedSlot: ExpenditureSlot = {
      ...existingSlot,
      id: expenditureSlotId,
      recipientAddress,
    };
    updatedSlots = [
      ...expenditure.slots.filter((slot) => slot.id !== expenditureSlotId),
      updatedSlot,
    ];
  }

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
      },
    },
  );
};
