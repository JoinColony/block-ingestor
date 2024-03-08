import {
  ColonyActionType,
  ExpenditureFragment,
  ExpenditurePayout,
  ExpenditureSlot,
  ExpenditureStatus,
} from '~graphql';
import { toNumber } from 'lodash';
import { verbose } from '~utils';
import { getUpdatedExpenditureSlots } from '~handlers/expenditures/helpers';
import { DecodedFunctions } from '../multicall';
import { getAmountLessFee, getNetworkInverseFee } from '~utils/networkFee';
import { BigNumber, utils } from 'ethers';
import {
  EXPENDITURESLOTS_SLOT,
  EXPENDITURESLOT_CLAIMDELAY,
  EXPENDITURESLOT_RECIPIENT,
} from '~constants';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { ContractEvent } from '~types';

export const isEditLockedExpenditureMotion = (
  decodedFunctions: DecodedFunctions,
  expenditureStatus: ExpenditureStatus,
): boolean => {
  const fragmentsToMatch = [
    'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)',
    'setExpenditureState',
  ];
  return (
    expenditureStatus === ExpenditureStatus.Locked &&
    decodedFunctions.every((decodedFunction) =>
      fragmentsToMatch.includes(decodedFunction.fragment),
    )
  );
};

export const editLockedExpenditureMotionHandler = (
  event: ContractEvent,
  gasEstimate: string,
  decodedFunctions: DecodedFunctions,
  expenditure: ExpenditureFragment,
): void => {
  let updatedSlots: ExpenditureSlot[] = [];

  decodedFunctions.forEach(async (decodedFunction) => {
    if (
      decodedFunction.fragment ===
      'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)'
    ) {
      const [, , , slotId, tokenAddress, amountWithFee] =
        decodedFunction.decodedAction;
      const convertedSlot = toNumber(slotId);
      const existingPayouts =
        expenditure.slots.find((slot) => slot.id === convertedSlot)?.payouts ??
        [];

      const networkInverseFee = (await getNetworkInverseFee()) ?? '0';
      const amountLessFee = getAmountLessFee(
        amountWithFee,
        networkInverseFee,
      ).toString();
      const feeAmount = BigNumber.from(amountWithFee)
        .sub(amountLessFee)
        .toString();

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

      updatedSlots = getUpdatedExpenditureSlots(expenditure, convertedSlot, {
        payouts: updatedPayouts,
      });
    } else if (decodedFunction.fragment === 'setExpenditureState') {
      const [, , , storageSlot, , keys, value] = decodedFunction.decodedAction;
      if (storageSlot.eq(EXPENDITURESLOTS_SLOT)) {
        const [slotId, slotType] = keys;

        if (slotType === EXPENDITURESLOT_RECIPIENT) {
          const recipientAddress = utils.defaultAbiCoder
            .decode(['address'], value)
            .toString();

          updatedSlots = getUpdatedExpenditureSlots(expenditure, slotId, {
            recipientAddress,
          });
        } else if (slotType === EXPENDITURESLOT_CLAIMDELAY) {
          const claimDelay = toNumber(value);

          updatedSlots = getUpdatedExpenditureSlots(expenditure, slotId, {
            claimDelay,
          });
        }
      }
    }
  });
  verbose('updatedSlots', updatedSlots);
  createMotionInDB(event, {
    type: ColonyActionType.EditLockedExpenditureMotion,
    gasEstimate,
    expenditureId: expenditure.id,
    // @TODO: create an optional field on the motion object to accept the updatedSlots here
  });
};
