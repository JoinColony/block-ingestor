import { BigNumber, utils } from 'ethers';
import { query } from '~amplifyClient';

import {
  ExpenditureBalance,
  ExpenditureFragment,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
} from '~graphql';

import { output } from './logger';
import { insertAtIndex } from './arrays';

export const getExpenditureDatabaseId = (
  colonyAddress: string,
  nativeExpenditureId: number,
): string => {
  let checksummedAddress: string;
  try {
    checksummedAddress = utils.getAddress(colonyAddress);
  } catch {
    checksummedAddress = colonyAddress;
  }

  return `${checksummedAddress}_${nativeExpenditureId}`;
};

export const getUpdatedExpenditureBalances = (
  expenditure: ExpenditureFragment,
  tokenAddress: string,
  amount: string,
  subtract: boolean = false,
): ExpenditureBalance[] => {
  const balances = expenditure.balances ?? [];

  const balanceIndex = balances.findIndex(
    (balance) => balance.tokenAddress === tokenAddress,
  );
  const balance = balanceIndex !== -1 ? balances[balanceIndex] : undefined;

  const amountToAdd = BigNumber.from(amount).mul(subtract ? -1 : 1);
  let updatedAmount = BigNumber.from(balance?.amount ?? 0).add(amountToAdd);

  if (updatedAmount.lt(0)) {
    /**
     * @NOTE: This is a temporary fix to prevent negative balances
     * The current theory is that when the move funds event is picked up
     * straight after the expenditure was created, it does not
     * get returned by DynamoDB yet
     */
    output(
      `Balance of expenditure ${expenditure.id} for token ${tokenAddress} would go negative. This is a bug and needs investigating.`,
    );
    updatedAmount = BigNumber.from(0);

    fetch('https://hooks.zapier.com/hooks/catch/20362233/2mnk4h2', {
      method: 'POST',
      body: JSON.stringify({
        message: `Balance of expenditure ${expenditure.id} for token ${tokenAddress} would go negative. This is a bug and needs investigating.`,
      }),
    });
  }

  const updatedBalance = {
    ...balance,
    tokenAddress,
    amount: updatedAmount.toString(),
  };
  const updatedBalanceIndex =
    balanceIndex !== -1 ? balanceIndex : balances.length;

  const updatedBalances = insertAtIndex(
    balances,
    updatedBalanceIndex,
    updatedBalance,
  );

  return updatedBalances;
};

export const getExpenditureByFundingPot = async (
  colonyAddress: string,
  fundingPotId: number,
): Promise<ExpenditureFragment | null> => {
  const response = await query<
    GetExpenditureByNativeFundingPotIdAndColonyQuery,
    GetExpenditureByNativeFundingPotIdAndColonyQueryVariables
  >(GetExpenditureByNativeFundingPotIdAndColonyDocument, {
    colonyAddress,
    nativeFundingPotId: fundingPotId,
  });

  const expenditure =
    response?.data?.getExpendituresByNativeFundingPotIdAndColony?.items?.[0] ??
    null;

  return expenditure;
};
