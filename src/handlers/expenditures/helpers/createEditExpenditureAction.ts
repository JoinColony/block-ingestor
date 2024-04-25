import { AnyColonyClient } from '@colony/colony-js';
import { utils } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureFragment,
  ExpenditurePayout,
  ExpenditureSlot,
  ExpenditureStatus,
  GetActionByIdDocument,
  GetActionByIdQuery,
  GetActionByIdQueryVariables,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getExpenditureDatabaseId,
  mapLogToContractEvent,
  toNumber,
  writeActionFromEvent,
} from '~utils';
import { convertToCallTrace } from '~utils/convertTrace';
import { splitAmountAndFee } from '~utils/networkFee';
import {
  decodeUpdatedSlot,
  decodeUpdatedStatus,
} from './decodeSetExpenditureState';
import { getUpdatedExpenditureSlots } from './getUpdatedSlots';

export enum CreateEditExpenditureActionResult {
  NotEditAction = 'NotEditAction',
}

const MULTICALL_SIGNATURE = '0xac9650d8';
const SET_EXPENDITURE_STATE_SIGNATURE = '0xc9a2ce7c';
const SET_EXPENDITURE_PAYOUT_SIGNATURE = '0xbae82ec9';

export const createEditExpenditureAction = async (
  event: ContractEvent,
  expenditure: ExpenditureFragment,
  colonyClient: AnyColonyClient,
): Promise<CreateEditExpenditureActionResult | undefined> => {
  const { transactionHash } = event;

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

  /**
   * @NOTE: Call trace will contain all the calls made in the transaction
   * We need to determine if there was a multicall containing calls to setExpenditureState and setExpenditurePayout
   */
  const callTrace = await getCallTrace(transactionHash);

  let setStateCount = 0;
  let setPayoutCount = 0;

  // @TODO: Implement counting potential calls to setExpenditureState and setExpenditurePayout before and after the multicall
  for (const call of callTrace.calls) {
    if (call.input.startsWith(MULTICALL_SIGNATURE)) {
      for (const subCall of call.calls) {
        if (subCall.input.startsWith(SET_EXPENDITURE_STATE_SIGNATURE)) {
          setStateCount += 1;
        } else if (subCall.input.startsWith(SET_EXPENDITURE_PAYOUT_SIGNATURE)) {
          setPayoutCount += 1;
        }
      }
    }
  }

  // If there are no relevant calls (or no multicall at all), there is no edit action
  if (!setStateCount && !setPayoutCount) {
    return CreateEditExpenditureActionResult.NotEditAction;
  }

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
    try {
      const event = await mapLogToContractEvent(log, colonyClient.interface);
      if (
        event?.signature === ContractEventsSignatures.ExpenditureStateChanged &&
        setStateCount > 0
      ) {
        actionEvents.push(event);
        setStateCount -= 1;
      } else if (
        event?.signature === ContractEventsSignatures.ExpenditurePayoutSet &&
        setPayoutCount > 0
      ) {
        actionEvents.push(event);
        setPayoutCount -= 1;
      }
    } catch {}
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
      const updatedSlot = decodeUpdatedSlot(actionEvent, expenditure);
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

const checkActionExists = async (transactionHash: string): Promise<boolean> => {
  const existingActionQuery = await query<
    GetActionByIdQuery,
    GetActionByIdQueryVariables
  >(GetActionByIdDocument, {
    id: transactionHash,
  });

  return !!existingActionQuery?.data?.getColonyAction;
};

const getCallTrace = async (transactionHash: string): Promise<any> => {
  const transaction = await provider.getTransaction(transactionHash);

  const isDev = process.env.NODE_ENV === 'development';
  const trace = await provider.send('debug_traceTransaction', [
    transactionHash,
    ...(!isDev ? [{ tracer: 'callTracer' }] : []),
  ]);

  let callTrace = trace;
  if (isDev) {
    callTrace = convertToCallTrace(trace, transaction);
  }

  return callTrace;
};
