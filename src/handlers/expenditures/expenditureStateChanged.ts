import { BigNumber, BigNumberish, ethers } from 'ethers';
import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber } from '~utils';
import { mutate } from '~amplifyClient';
import {
  ExpenditureSlot,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';

import {
  getExpenditureFromDB,
  getSlotsWithUpdatedClaimDelay,
  getSlotsWithUpdatedPayoutModifier,
  getSlotsWithUpdatedRecipient,
} from './helpers';

const toB32 = (input: BigNumberish): string =>
  ethers.utils.hexZeroPad(ethers.utils.hexlify(input), 32);

const EXPENDITURESLOTS_SLOT = BigNumber.from(26);

const EXPENDITURESLOT_RECIPIENT = toB32(ethers.BigNumber.from(0));
const EXPENDITURESLOT_CLAIMDELAY = toB32(ethers.BigNumber.from(1));
const EXPENDITURESLOT_PAYOUTMODIFIER = toB32(ethers.BigNumber.from(2));

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { storageSlot, value, expenditureId } = event.args;
  // The unfortunate naming of the `keys` property means we have to access it like so
  const keys = event.args[4];
  const convertedExpenditureId = toNumber(expenditureId);

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const expenditure = await getExpenditureFromDB(databaseId);
  if (!expenditure) {
    output(
      `Could not find expenditure with ID: ${databaseId} in the db. This is a bug and needs investigating.`,
    );
    return;
  }

  let updatedSlots: ExpenditureSlot[] | undefined;

  if (storageSlot.eq(EXPENDITURESLOTS_SLOT)) {
    const slotId = ethers.BigNumber.from(keys[0]).toNumber();

    if (keys[1] === EXPENDITURESLOT_RECIPIENT) {
      const recipientAddress = ethers.utils.defaultAbiCoder
        .decode(['address'], value)
        .toString();

      updatedSlots = getSlotsWithUpdatedRecipient(
        expenditure,
        slotId,
        recipientAddress,
      );
    } else if (keys[1] === EXPENDITURESLOT_CLAIMDELAY) {
      const claimDelay = ethers.BigNumber.from(value).toNumber();

      updatedSlots = getSlotsWithUpdatedClaimDelay(
        expenditure,
        slotId,
        claimDelay,
      );
    } else if (keys[1] === EXPENDITURESLOT_PAYOUTMODIFIER) {
      const payoutModifier = ethers.BigNumber.from(value).toNumber();

      updatedSlots = getSlotsWithUpdatedPayoutModifier(
        expenditure,
        slotId,
        payoutModifier,
      );
    }
  }

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
      },
    },
  );
};
