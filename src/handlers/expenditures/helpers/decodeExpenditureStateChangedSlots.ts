import { BigNumber, BigNumberish, utils } from 'ethers';

import { ExpenditureFragment, ExpenditureSlot } from '~graphql';

import { getUpdatedExpenditureSlots } from './getUpdatedSlots';

const toB32 = (input: BigNumberish): string =>
  utils.hexZeroPad(utils.hexlify(input), 32);

const EXPENDITURESLOTS_SLOT = BigNumber.from(26);

const EXPENDITURESLOT_RECIPIENT = toB32(BigNumber.from(0));
const EXPENDITURESLOT_CLAIMDELAY = toB32(BigNumber.from(1));
const EXPENDITURESLOT_PAYOUTMODIFIER = toB32(BigNumber.from(2));

/**
 * Util function decoding the changes to the expenditure resulting from
 * the ExpenditureStateChanged event and merging them with the existing slots
 * It supports changes to the following properties:
 *  - Recipient address
 *  - Claim delay
 *  - Payout modifier
 * If there were no changes to the expenditure slots, it returns null
 */
export const decodeExpenditureStateChangedSlots = (
  expenditure: ExpenditureFragment,
  storageSlot: BigNumber,
  keys: string[],
  value: string,
): ExpenditureSlot[] | null => {
  let updatedSlots: ExpenditureSlot[] | null = null;

  if (storageSlot.eq(EXPENDITURESLOTS_SLOT)) {
    const slotId = BigNumber.from(keys[0]).toNumber();

    if (keys[1] === EXPENDITURESLOT_RECIPIENT) {
      const recipientAddress = utils.defaultAbiCoder
        .decode(['address'], value)
        .toString();

      updatedSlots = getUpdatedExpenditureSlots(expenditure, slotId, {
        recipientAddress,
      });
    } else if (keys[1] === EXPENDITURESLOT_CLAIMDELAY) {
      const claimDelay = BigNumber.from(value).toNumber();

      updatedSlots = getUpdatedExpenditureSlots(expenditure, slotId, {
        claimDelay,
      });
    } else if (keys[1] === EXPENDITURESLOT_PAYOUTMODIFIER) {
      const payoutModifier = BigNumber.from(value).toNumber();

      updatedSlots = getUpdatedExpenditureSlots(expenditure, slotId, {
        payoutModifier,
      });
    }
  }

  return updatedSlots;
};
