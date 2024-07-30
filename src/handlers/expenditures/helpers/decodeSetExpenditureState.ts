import { BigNumber, BigNumberish, utils } from 'ethers';

import {
  ExpenditureSlotFragment as ExpenditureSlot,
  ExpenditureStatus,
} from '~graphql';
import { toNumber } from '~utils';

import {
  EXPENDITURESLOTS_SLOT,
  EXPENDITURESLOT_CLAIMDELAY,
  EXPENDITURESLOT_PAYOUTMODIFIER,
  EXPENDITURESLOT_RECIPIENT,
  EXPENDITURES_SLOT,
  EXPENDITURE_OWNER_AND_STATUS,
} from '~constants';
import { ContractEvent } from '~types';

interface SetExpenditureStateParams {
  storageSlot: BigNumberish;
  keys: string[];
  value: string;
}

/**
 * Util function decoding changes to the expenditure slot resulting from
 * an ExpenditureStateChanged event
 * It supports changes to the following properties:
 *  - Recipient address
 *  - Claim delay
 *  - Payout modifier
 * If there were no changes to the expenditure slot, it returns undefined
 */
export const decodeUpdatedSlot = (
  expenditureSlots: ExpenditureSlot[],
  params: SetExpenditureStateParams,
): ExpenditureSlot | undefined => {
  const { storageSlot, value, keys } = params;

  let updatedSlot: ExpenditureSlot | undefined;

  if (BigNumber.from(storageSlot).eq(EXPENDITURESLOTS_SLOT)) {
    const slotId = toNumber(keys[0]);

    const existingSlot = expenditureSlots.find(
      ({ id }) => id === toNumber(keys[0]),
    );

    if (keys[1] === EXPENDITURESLOT_RECIPIENT) {
      const recipientAddress = utils.defaultAbiCoder
        .decode(['address'], value)
        .toString();

      if (recipientAddress !== existingSlot?.recipientAddress) {
        updatedSlot = {
          ...existingSlot,
          id: slotId,
          recipientAddress,
        };
      }
    } else if (keys[1] === EXPENDITURESLOT_CLAIMDELAY) {
      const claimDelay = BigNumber.from(value).toString();

      if (claimDelay !== existingSlot?.claimDelay) {
        updatedSlot = {
          ...existingSlot,
          id: slotId,
          claimDelay,
        };
      }
    } else if (keys[1] === EXPENDITURESLOT_PAYOUTMODIFIER) {
      const payoutModifier = toNumber(value);

      if (payoutModifier !== existingSlot?.payoutModifier) {
        updatedSlot = {
          ...existingSlot,
          id: slotId,
          payoutModifier,
        };
      }
    }
  }

  return updatedSlot;
};

const EXPENDITURE_CONTRACT_STATUS_TO_ENUM: Record<number, ExpenditureStatus> = {
  0: ExpenditureStatus.Draft,
  1: ExpenditureStatus.Cancelled,
  2: ExpenditureStatus.Finalized,
  3: ExpenditureStatus.Locked,
};

/**
 * Util decoding changes to expenditure status following an ExpenditureStateChanged event
 */
export const decodeUpdatedStatus = (
  event: ContractEvent,
): ExpenditureStatus | undefined => {
  const { storageSlot, value } = event.args;
  // The unfortunate naming of the `keys` property means we have to access it like so
  const keys = event.args[4];

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
