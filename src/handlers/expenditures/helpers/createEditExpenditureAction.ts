import { AnyColonyClient } from '@colony/colony-js';
import { utils } from 'ethers';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureFragment,
  ExpenditurePayout,
  ExpenditureSlot,
  ExpenditureStatus,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  checkActionExists,
  getExpenditureDatabaseId,
  mapLogToContractEvent,
  toNumber,
  transactionHasEvent,
  writeActionFromEvent,
} from '~utils';
import { splitAmountAndFee } from '~utils/networkFee';
import {
  decodeUpdatedSlot,
  decodeUpdatedStatus,
} from './decodeSetExpenditureState';
import { getUpdatedExpenditureSlots } from './getUpdatedSlots';

export class NotEditActionError extends Error {
  constructor() {
    super('Transaction does not contain edit expenditure action');
  }
}

/**
 * This function gets called for both `ExpenditureStateChanged` and `ExpenditurePayoutSet` events
 * It determines whether the event is part of an edit action and creates it in the DB
 * Otherwise, it returns a result allowing the handler to continue processing as normal
 */
export const createEditExpenditureAction = async (
  event: ContractEvent,
  expenditure: ExpenditureFragment,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const { transactionHash } = event;

  const hasOneTxPaymentEvent = await transactionHasEvent(
    transactionHash,
    ContractEventsSignatures.OneTxPaymentMade,
  );

  if (!expenditure.firstEditTransactionHash || hasOneTxPaymentEvent) {
    /**
     * If expenditure doesn't have `firstEditTransactionHash` set, it means it's the first time
     * we see an ExpenditurePayoutSet event, which is normally part of expenditure creation
     * Only subsequent ExpenditurePayoutSet events will be considered as edit actions
     */
    throw new NotEditActionError();
  }

  const actionExists = await checkActionExists(transactionHash);
  if (actionExists) {
    return;
  }

  const { contractAddress: colonyAddress, blockNumber } = event;
  const { expenditureId } = event.args;

  const convertedExpenditureId = toNumber(expenditureId);
  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const logs = await provider.getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [
      [
        utils.id(ContractEventsSignatures.ExpenditureStateChanged),
        utils.id(ContractEventsSignatures.ExpenditurePayoutSet),
      ],
    ],
  });

  const actionEvents = [];
  for (const log of logs) {
    const mappedEvent = await mapLogToContractEvent(
      log,
      colonyClient.interface,
    );
    if (mappedEvent) {
      actionEvents.push(mappedEvent);
    }
  }
  /**
   * Determine changes to the expenditure after all relevant events have been processed
   */
  let updatedSlots: ExpenditureSlot[] = expenditure.slots;
  let hasUpdatedSlots = false;
  let updatedStatus: ExpenditureStatus | undefined;

  for (const actionEvent of actionEvents) {
    if (
      actionEvent.signature === ContractEventsSignatures.ExpenditureStateChanged
    ) {
      const { storageSlot, value } = actionEvent.args;
      const keys = actionEvent.args[4];

      const updatedSlot = decodeUpdatedSlot(expenditure, {
        storageSlot,
        keys,
        value,
      });

      if (updatedSlot) {
        updatedSlots = getUpdatedExpenditureSlots(
          updatedSlots,
          updatedSlot.id,
          updatedSlot,
        );

        hasUpdatedSlots = true;
      }

      const decodedStatus = decodeUpdatedStatus(actionEvent);
      if (decodedStatus) {
        updatedStatus = decodedStatus;
      }
    } else if (
      actionEvent.signature === ContractEventsSignatures.ExpenditurePayoutSet
    ) {
      const {
        slot,
        token: tokenAddress,
        amount: amountWithFee,
      } = actionEvent.args;

      const convertedSlot = toNumber(slot);
      const existingPayouts =
        expenditure.slots.find((slot) => slot.id === convertedSlot)?.payouts ??
        [];

      const [amountLessFee, feeAmount] = await splitAmountAndFee(amountWithFee);

      const updatedPayouts: ExpenditurePayout[] = [
        ...existingPayouts.filter(
          (payout) => payout.tokenAddress !== tokenAddress,
        ),
        {
          tokenAddress,
          amount: amountLessFee,
          networkFee: feeAmount,
          isClaimed: false,
        },
      ];

      updatedSlots = getUpdatedExpenditureSlots(updatedSlots, convertedSlot, {
        payouts: updatedPayouts,
      });

      hasUpdatedSlots = true;
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

  if (hasUpdatedSlots) {
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
