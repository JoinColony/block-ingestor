import { BigNumber, utils } from 'ethers';

import { ExpenditureBalance } from '~graphql';

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
  balances: ExpenditureBalance[],
  tokenAddress: string,
  amount: string,
  subtract: boolean = false,
): ExpenditureBalance[] => {
  const balanceIndex = balances.findIndex(
    (balance) => balance.tokenAddress === tokenAddress,
  );
  const balance = balanceIndex !== -1 ? balances[balanceIndex] : undefined;

  const amountToAdd = BigNumber.from(amount).mul(subtract ? -1 : 1);
  const updatedAmount = BigNumber.from(balance?.amount ?? 0).add(amountToAdd);

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
