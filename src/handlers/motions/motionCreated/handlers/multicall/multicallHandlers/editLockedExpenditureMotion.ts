import { ColonyActionType, ExpenditurePayout } from '~graphql';
import { toNumber } from 'lodash';
import { BigNumber } from 'ethers';
import {
  decodeUpdatedSlot,
  getUpdatedExpenditureSlots,
  getExpenditureFromDB,
} from '~handlers/expenditures/helpers';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { MulticallHandler, MulticallValidator } from './types';
import { ContractMethodSignatures } from '~types';
import { splitAmountAndFee } from '~utils/networkFee';
import { getExpenditureDatabaseId } from '~utils';
import { EXPENDITURESLOTS_SLOT } from '~constants';

export const isEditLockedExpenditureMotion: MulticallValidator = ({
  decodedFunctions,
}) => {
  const signaturesToMatch = [
    ContractMethodSignatures.SetExpenditurePayout,
    ContractMethodSignatures.SetExpenditureState,
  ];

  return signaturesToMatch.includes(decodedFunctions[0].functionSignature);
};

export const editLockedExpenditureMotionHandler: MulticallHandler = async ({
  event,
  gasEstimate,
  decodedFunctions,
}) => {
  /**
   * @NOTE: We get expenditure ID from the first multicall function
   * This means if the multicall edits multiple expenditures, we will only create a motion for the first one
   */
  const expenditureId = decodedFunctions[0]?.args._id;
  const convertedExpenditureId = toNumber(expenditureId);
  const databaseId = getExpenditureDatabaseId(
    event.colonyAddress ?? '',
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    return;
  }

  let updatedSlots = expenditure.slots;

  for (const decodedFunction of decodedFunctions) {
    const decodedFunctionExpenditureId = decodedFunction.args._id;
    if (!BigNumber.from(decodedFunctionExpenditureId).eq(expenditureId)) {
      continue;
    }

    if (
      decodedFunction.functionSignature ===
      ContractMethodSignatures.SetExpenditurePayout
    ) {
      const [, , , slotId, tokenAddress, amountWithFee] = decodedFunction.args;
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
      decodedFunction.functionSignature ===
      ContractMethodSignatures.SetExpenditureState
    ) {
      const [, , , storageSlot, , keys, value] = decodedFunction.args;
      if (storageSlot.eq(EXPENDITURESLOTS_SLOT)) {
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
  }

  createMotionInDB(event, {
    type: ColonyActionType.EditExpenditureMotion,
    gasEstimate,
    expenditureId: expenditure.id,
    editedExpenditureSlots: updatedSlots,
  });
};
