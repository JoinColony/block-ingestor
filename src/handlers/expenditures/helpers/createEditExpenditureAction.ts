import { AnyColonyClient } from '@colony/colony-js';
import { utils } from 'ethers';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureSlot,
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getExpenditureDatabaseId,
  mapLogToContractEvent,
  notNull,
  toNumber,
  writeActionFromEvent,
} from '~utils';
import {
  decodeUpdatedSlot,
  decodeUpdatedStatus,
} from './decodeSetExpenditureState';
import { getExpenditureFromDB } from './getExpenditure';
import { getUpdatedExpenditureSlotsWithHistory } from './getUpdatedSlots';

export const createEditExpenditureAction = async (
  event: ContractEvent,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash, logIndex } = event;

  const receipt = await provider.getTransactionReceipt(transactionHash);
  const logs = await Promise.all(
    receipt.logs.filter(
      (log) =>
        log.topics.includes(
          utils.id(ContractEventsSignatures.ExpenditureStateChanged),
        ) ||
        log.topics.includes(
          utils.id(ContractEventsSignatures.ExpenditurePayoutSet),
        ),
    ),
  );

  /**
   * Do not create action if the event is not the first relevant log in the transaction
   */
  if (logIndex !== logs[0]?.logIndex) {
    return;
  }

  const { expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    return;
  }

  let updatedSlots: ExpenditureSlot[] = [];
  let updatedStatus: ExpenditureStatus | undefined;

  const events = (
    await Promise.all(
      logs.map((log) => mapLogToContractEvent(log, colonyClient.interface)),
    )
  ).filter(notNull);

  for (const event of events) {
    if (event.signature === ContractEventsSignatures.ExpenditureStateChanged) {
      const { storageSlot, value } = event.args;
      // The unfortunate naming of the `keys` property means we have to access it like so
      const keys = event.args[4];

      const updatedSlot = decodeUpdatedSlot(
        expenditure,
        storageSlot,
        keys,
        value,
      );
      if (updatedSlot) {
        updatedSlots = getUpdatedExpenditureSlotsWithHistory(
          expenditure.slots,
          updatedSlot.id,
          updatedSlot,
          updatedSlots,
        );
      }

      const decodedStatus = decodeUpdatedStatus(storageSlot, keys, value);
      if (decodedStatus) {
        updatedStatus = decodedStatus;
      }
    }
  }

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
        status: updatedStatus,
      },
    },
  );

  if (updatedSlots) {
    const { agent: initiatorAddress } = event.args;

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.EditExpenditure,
      initiatorAddress,
      expenditureId: databaseId,
      expenditureSlotChanges: {
        oldSlots: expenditure.slots,
        newSlots: updatedSlots,
      },
    });
  }
};
