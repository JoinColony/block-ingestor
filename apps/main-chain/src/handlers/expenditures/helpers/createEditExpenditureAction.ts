import { AnyColonyClient } from '@colony/colony-js';
import { utils } from 'ethers';
import { isEqual, omit } from 'lodash';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureFragment,
  ExpenditurePayout,
  ExpenditureSlot,
  ExpenditureStatus,
  ExpenditureType,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '@joincolony/graphql';
import rpcProvider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '@joincolony/blocks';
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
 * @TODO: Refactor once multicall limitations are resolved
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

  if (hasOneTxPaymentEvent) {
    throw new NotEditActionError();
  }

  if (
    !expenditure.firstEditTransactionHash ||
    expenditure.firstEditTransactionHash === transactionHash
  ) {
    /**
     * If this is the first transaction containing the relevant events, it is
     * part of expenditure creation
     * Only subsequent events will be considered as edit actions
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

  const logs = await rpcProvider.getProviderInstance().getLogs({
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
  let updatedStatus: ExpenditureStatus | undefined;

  let shouldCreateAction = false;

  for (const actionEvent of actionEvents) {
    if (
      actionEvent.signature === ContractEventsSignatures.ExpenditureStateChanged
    ) {
      const { storageSlot, value } = actionEvent.args;
      const keys = actionEvent.args[4];

      const updatedSlot = decodeUpdatedSlot(updatedSlots, {
        storageSlot,
        keys,
        value,
      });

      if (updatedSlot) {
        const preUpdateSlot = updatedSlots.find(
          ({ id }) => id === updatedSlot?.id,
        );

        updatedSlots = getUpdatedExpenditureSlots(
          updatedSlots,
          updatedSlot.id,
          updatedSlot,
        );

        /**
         * Special case for staged expenditure
         * If the only change was claim delay set to 0, we assume it was a stage release
         * Otherwise, we set the flag to create an action
         */
        const hasClaimDelayChangedToZero =
          preUpdateSlot?.claimDelay !== '0' && updatedSlot.claimDelay === '0';
        const hasOtherChanges = !isEqual(
          omit(preUpdateSlot, 'claimDelay'),
          omit(updatedSlot, 'claimDelay'),
        );

        if (
          expenditure.type !== ExpenditureType.Staged ||
          !hasClaimDelayChangedToZero ||
          hasOtherChanges
        ) {
          shouldCreateAction = true;
        }
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

      shouldCreateAction = true;
    }
  }

  await amplifyClient.mutate<
    UpdateExpenditureMutation,
    UpdateExpenditureMutationVariables
  >(UpdateExpenditureDocument, {
    input: {
      id: databaseId,
      slots: updatedSlots,
      status: updatedStatus,
    },
  });

  if (shouldCreateAction) {
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
