import { BigNumber } from 'ethers';

import { ContractEvent } from '~types';
import { getExpenditureDatabaseId, output, toNumber, verbose } from '~utils';
import {
  ExpenditurePayout,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import { getAmountLessFee, getNetworkInverseFee } from '~utils/networkFee';

import { getExpenditureFromDB, getUpdatedExpenditureSlots } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { expenditureId, slot, token: tokenAddress, amount } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);

  const networkInverseFee = (await getNetworkInverseFee()) ?? '0';
  const amountLessFee = getAmountLessFee(amount, networkInverseFee).toString();
  const feeAmount = BigNumber.from(amount).sub(amountLessFee).toString();

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

  const existingPayouts =
    expenditure.slots.find((slot) => slot.id === convertedSlot)?.payouts ?? [];

  const updatedPayouts: ExpenditurePayout[] = [
    ...existingPayouts.filter((payout) => payout.tokenAddress !== tokenAddress),
    {
      tokenAddress,
      amount: amountLessFee,
      networkFee: feeAmount,
      isClaimed: false,
    },
  ];

  const updatedSlots = getUpdatedExpenditureSlots(
    expenditure.slots,
    convertedSlot,
    {
      payouts: updatedPayouts,
    },
  );

  verbose(
    `Payout set for expenditure with ID ${convertedExpenditureId} in colony ${colonyAddress}`,
  );

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
