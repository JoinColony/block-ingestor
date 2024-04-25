import {
  ColonyActionType,
  ExpenditurePayout,
  ExpenditureStatus,
} from '~graphql';
import { toNumber } from 'lodash';
import {
  decodeUpdatedSlot,
  getUpdatedExpenditureSlots,
} from '~handlers/expenditures/helpers';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { MulticallHandler, MulticallValidator } from '../fragments';
import { ContractMethodSignatures } from '~types';
import { splitAmountAndFee } from '~utils/networkFee';

export const isEditLockedExpenditureMotion: MulticallValidator = ({
  decodedFunctions,
  expenditureStatus,
}) => {
  const fragmentsToMatch = [
    ContractMethodSignatures.SetExpenditurePayout,
    ContractMethodSignatures.SetExpenditureState,
  ];
  return (
    expenditureStatus === ExpenditureStatus.Locked &&
    decodedFunctions.every((decodedFunction) =>
      fragmentsToMatch.includes(decodedFunction.fragment),
    )
  );
};

export const editLockedExpenditureMotionHandler: MulticallHandler = async ({
  event,
  gasEstimate,
  decodedFunctions,
  expenditure,
}) => {
  if (!expenditure) {
    return;
  }

  let updatedSlots = expenditure.slots;

  for (const decodedFunction of decodedFunctions) {
    if (
      decodedFunction.fragment === ContractMethodSignatures.SetExpenditurePayout
    ) {
      const [, , , slotId, tokenAddress, amountWithFee] =
        decodedFunction.decodedAction;
      const convertedSlot = toNumber(slotId);
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
    } else if (
      decodedFunction.fragment === ContractMethodSignatures.SetExpenditureState
    ) {
      const [, , , storageSlot, , keys, value] = decodedFunction.decodedAction;

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
      }
    }
  }

  createMotionInDB(event, {
    type: ColonyActionType.EditExpenditureMotion,
    gasEstimate,
    expenditureId: expenditure.id,
    editedExpenditureSlots: updatedSlots,
  });
};
