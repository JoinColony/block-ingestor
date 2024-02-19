import { BigNumber } from 'ethers';

import { ContractEvent } from '~types';
import {
  createFundsClaim,
  getExpenditureDatabaseId,
  insertAtIndex,
  isColonyAddress,
  output,
  toNumber,
  verbose,
} from '~utils';
import {
  ExpenditurePayout,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import { getNetworkInverseFee } from '~utils/networkFee';

import { getExpenditureFromDB } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const {
    id: expenditureId,
    slot,
    token: tokenAddress,
    tokenPayout: amountWithoutFee,
  } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlotId = toNumber(slot);
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

  const existingSlotIndex = expenditure.slots.findIndex(
    (slot) => slot.id === convertedSlotId,
  );
  const existingSlot = expenditure.slots[existingSlotIndex];
  if (!existingSlot || !existingSlot.payouts) {
    return;
  }

  const existingPayoutIndex = existingSlot.payouts.findIndex(
    (payout) => payout.tokenAddress === tokenAddress,
  );
  const existingPayout = existingSlot.payouts[existingPayoutIndex];
  if (!existingPayout) {
    return;
  }

  const updatedPayouts: ExpenditurePayout[] = insertAtIndex(
    existingSlot.payouts,
    existingPayoutIndex,
    {
      ...existingPayout,
      isClaimed: true,
    },
  );
  const updatedSlots = insertAtIndex(expenditure.slots, existingSlotIndex, {
    ...existingSlot,
    payouts: updatedPayouts,
  });

  const networkInverseFee = (await getNetworkInverseFee()) ?? '0';

  // NOTE: The equation to calculate totalToPay is as following (in Wei)
  // totalToPay = (receivedAmount + 1) * (feeInverse / (feeInverse -1))
  // The network adds 1 wei extra fee after the percentage calculation
  // For more info check out
  // https://github.com/JoinColony/colonyNetwork/blob/806e4d5750dc3a6b9fa80f6e007773b28327c90f/contracts/colony/ColonyFunding.sol#L656

  const amountWithFee = BigNumber.from(amountWithoutFee)
    .add(1)
    .mul(networkInverseFee)
    .div(BigNumber.from(networkInverseFee).sub(1))
    .toString();

  const existingBalances = expenditure.balances ?? [];
  const existingTokenBalanceIndex = existingBalances.findIndex(
    (balance) => balance.tokenAddress === tokenAddress,
  );
  const existingTokenBalance =
    existingTokenBalanceIndex !== -1
      ? existingBalances[existingTokenBalanceIndex]
      : undefined;

  const updatedAmount = existingTokenBalance
    ? BigNumber.from(existingTokenBalance.amount).sub(amountWithFee).toString()
    : BigNumber.from(amountWithFee).mul(-1).toString();
  const updatedTokenBalance = {
    tokenAddress,
    amount: updatedAmount,
  };
  const updatedTokenBalanceIndex =
    existingTokenBalanceIndex !== -1
      ? existingTokenBalanceIndex
      : existingBalances.length;

  const updatedBalances = insertAtIndex(
    existingBalances,
    updatedTokenBalanceIndex,
    updatedTokenBalance,
  );

  verbose(`Payout claimed in expenditure with ID ${databaseId}`);

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: databaseId,
        slots: updatedSlots,
        balances: updatedBalances,
      },
    },
  );

  /**
   * If a payout is claimed by a colony, we need to create a funds claim in the database
   * @NOTE: After contracts update, OneTxPayment payments emit this event too
   */
  const { recipientAddress } = existingSlot;
  const isColony = await isColonyAddress(recipientAddress ?? '');
  if (recipientAddress && isColony) {
    await createFundsClaim({
      colonyAddress: recipientAddress,
      tokenAddress,
      amount: existingPayout.amount.toString(),
      event,
    });
  }
};
