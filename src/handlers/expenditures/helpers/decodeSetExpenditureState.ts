import { BigNumber, utils } from 'ethers';

import {
  ExpenditureFragment,
  ExpenditureSlot,
  ExpenditureStatus,
} from '~graphql';
import { toNumber } from '~utils';

import { getUpdatedExpenditureSlots } from './getUpdatedSlots';
import {
  EXPENDITURESLOTS_SLOT,
  EXPENDITURESLOT_CLAIMDELAY,
  EXPENDITURESLOT_PAYOUTMODIFIER,
  EXPENDITURESLOT_RECIPIENT,
  EXPENDITURES_SLOT,
  EXPENDITURE_OWNER_AND_STATUS,
} from '~constants';

/**
 * Util function decoding the changes to the expenditure resulting from
 * the ExpenditureStateChanged event and merging them with the existing slots
 * It supports changes to the following properties:
 *  - Recipient address
 *  - Claim delay
 *  - Payout modifier
 * If there were no changes to the expenditure slots, it returns undefined
 */
export const decodeUpdatedSlots = (
  expenditure: ExpenditureFragment,
  storageSlot: BigNumber,
  keys: string[],
  value: string,
): ExpenditureSlot[] | undefined => {
  let updatedSlots: ExpenditureSlot[] | undefined;

  if (storageSlot.eq(EXPENDITURESLOTS_SLOT)) {
    const slotId = toNumber(keys[0]);

    if (keys[1] === EXPENDITURESLOT_RECIPIENT) {
      const recipientAddress = utils.defaultAbiCoder
        .decode(['address'], value)
        .toString();

      updatedSlots = getUpdatedExpenditureSlots(expenditure.slots, slotId, {
        recipientAddress,
      });
    } else if (keys[1] === EXPENDITURESLOT_CLAIMDELAY) {
      const claimDelay = BigNumber.from(value).toString();

      updatedSlots = getUpdatedExpenditureSlots(expenditure.slots, slotId, {
        claimDelay,
      });
    } else if (keys[1] === EXPENDITURESLOT_PAYOUTMODIFIER) {
      const payoutModifier = toNumber(value);

      updatedSlots = getUpdatedExpenditureSlots(expenditure.slots, slotId, {
        payoutModifier,
      });
    }
  }

  return updatedSlots;
};

const EXPENDITURE_CONTRACT_STATUS_TO_ENUM: Record<number, ExpenditureStatus> = {
  0: ExpenditureStatus.Draft,
  1: ExpenditureStatus.Cancelled,
  2: ExpenditureStatus.Finalized,
  3: ExpenditureStatus.Locked,
};

export const decodeUpdatedStatus = (
  storageSlot: BigNumber,
  keys: string[],
  value: string,
): ExpenditureStatus | undefined => {
  let updatedStatus: ExpenditureStatus | undefined;

  if (storageSlot.eq(EXPENDITURES_SLOT)) {
    if (keys[0] === EXPENDITURE_OWNER_AND_STATUS) {
      // Status is encoded as the last byte (2 characters) of the value
      const statusValue = toNumber(value.slice(-2));
      updatedStatus = EXPENDITURE_CONTRACT_STATUS_TO_ENUM[statusValue];
    }
  }

  return updatedStatus;
};
