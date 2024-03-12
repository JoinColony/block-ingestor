import {
  ColonyActionType,
  ExpenditurePayout,
  ExpenditureSlot,
  ExpenditureStatus,
} from '~graphql';
import { toNumber } from 'lodash';
import { getUpdatedExpenditureSlots } from '~handlers/expenditures/helpers';
import { utils } from 'ethers';
import {
  EXPENDITURESLOTS_SLOT,
  EXPENDITURESLOT_CLAIMDELAY,
  EXPENDITURESLOT_RECIPIENT,
} from '~constants';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { MulticallHandler, MulticallValidator } from '../fragments';
import { ContractMethodSignatures } from '~types';
import { splitAmountAndFee } from '~utils/networkFee';

export const isEditLockedExpenditureMotion: MulticallValidator = ({
  decodedFunctions,
  expenditureStatus,
}) => {
  const fragmentsToMatch = [
    ContractMethodSignatures.setExpenditurePayout,
    ContractMethodSignatures.setExpenditureState,
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
  let updatedSlots: ExpenditureSlot[] = [];

  if (!expenditure) {
    return;
  }

  for (const decodedFunction of decodedFunctions) {
    if (
      decodedFunction.fragment === ContractMethodSignatures.setExpenditurePayout
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

      updatedSlots = getUpdatedExpenditureSlots(
        expenditure.slots,
        convertedSlot,
        {
          payouts: updatedPayouts,
        },
        updatedSlots,
      );
    } else if (
      decodedFunction.fragment === ContractMethodSignatures.setExpenditureState
    ) {
      const [, , , storageSlot, , keys, value] = decodedFunction.decodedAction;
      if (storageSlot.eq(EXPENDITURESLOTS_SLOT)) {
        const [slotId, slotType] = keys;

        const convertedSlot = toNumber(slotId);

        if (slotType === EXPENDITURESLOT_RECIPIENT) {
          const recipientAddress = utils.defaultAbiCoder
            .decode(['address'], value)
            .toString();

          updatedSlots = getUpdatedExpenditureSlots(
            expenditure.slots,
            convertedSlot,
            {
              recipientAddress,
            },
            updatedSlots,
          );
        } else if (slotType === EXPENDITURESLOT_CLAIMDELAY) {
          const claimDelay = toNumber(value).toString();

          updatedSlots = getUpdatedExpenditureSlots(
            expenditure.slots,
            convertedSlot,
            {
              claimDelay,
            },
            updatedSlots,
          );
        }
      }
    }
  }

  createMotionInDB(event, {
    type: ColonyActionType.EditLockedExpenditureMotion,
    gasEstimate,
    expenditureId: expenditure.id,
    editedExpenditureSlots: updatedSlots,
  });
};
