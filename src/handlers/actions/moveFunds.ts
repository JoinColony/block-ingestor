import { BigNumber } from 'ethers';

import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  toNumber,
  writeActionFromEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
  isDomainFromFundingPotSupported,
  getUpdatedExpenditureBalances,
  transactionHasEvent,
  getExpenditureByFundingPot,
} from '~utils';
import {
  ColonyActionType,
  ExpenditureBalance,
  ExpenditureFragment,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import {
  NotificationCategory,
  NotificationType,
  sendExpenditureUpdateNotifications,
  sendPermissionsActionNotifications,
} from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    blockNumber,
    transactionHash,
  } = event;
  const {
    agent: initiatorAddress,
    token: tokenAddress,
    amount,
    fromPot,
    toPot,
  } = event.args;

  const fromPotId = toNumber(fromPot);
  const toPotId = toNumber(toPot);

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  let fromDomainId: BigNumber | undefined;
  let toDomainId: BigNumber | undefined;

  if (isDomainFromFundingPotSupported(colonyClient)) {
    fromDomainId = await colonyClient.getDomainFromFundingPot(fromPot, {
      blockTag: blockNumber,
    });
    toDomainId = await colonyClient.getDomainFromFundingPot(toPot, {
      blockTag: blockNumber,
    });
  }

  // Check if the target pot belongs to an expenditure by trying to fetch it
  const targetExpenditure = await getExpenditureByFundingPot(
    colonyAddress,
    toPotId,
  );

  const hasOneTxPaymentEvent = await transactionHasEvent(
    transactionHash,
    ContractEventsSignatures.OneTxPaymentMade,
  );

  if (!hasOneTxPaymentEvent) {
    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.MoveFunds,
      initiatorAddress,
      tokenAddress,
      amount: amount.toString(),
      fromDomainId: fromDomainId
        ? getDomainDatabaseId(colonyAddress, toNumber(fromDomainId))
        : undefined,
      toDomainId: toDomainId
        ? getDomainDatabaseId(colonyAddress, toNumber(toDomainId))
        : undefined,
      fromPotId,
      toPotId,
      expenditureId: targetExpenditure?.id,
    });
  }

  if (targetExpenditure) {
    await updateExpenditureBalances({
      expenditure: targetExpenditure,
      tokenAddress,
      amount,
      colonyAddress,
      initiatorAddress,
      isPartOfOneTxPayment: hasOneTxPaymentEvent,
    });
  }

  if (!hasOneTxPaymentEvent) {
    sendPermissionsActionNotifications({
      creator: initiatorAddress,
      colonyAddress,
      transactionHash,
      notificationCategory: NotificationCategory.Payment,
    });
  }
};

interface UpdateExpenditureBalancesArgs {
  expenditure: ExpenditureFragment;
  tokenAddress: string;
  amount: string;
  colonyAddress: string;
  initiatorAddress: string;
  isPartOfOneTxPayment: boolean;
}

const updateExpenditureBalances = async ({
  expenditure,
  tokenAddress,
  amount,
  colonyAddress,
  initiatorAddress,
  isPartOfOneTxPayment,
}: UpdateExpenditureBalancesArgs): Promise<void> => {
  const updatedBalances = getUpdatedExpenditureBalances(
    expenditure.balances ?? [],
    tokenAddress,
    amount,
  );

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    {
      input: {
        id: expenditure.id,
        balances: updatedBalances,
      },
    },
  );

  if (
    !isPartOfOneTxPayment &&
    isExpenditureFullyFunded(expenditure, updatedBalances)
  ) {
    sendExpenditureUpdateNotifications({
      colonyAddress,
      creator: initiatorAddress,
      notificationType: NotificationType.ExpenditureReadyForRelease,
      expenditureID: expenditure.id,
    });
  }
};

/**
 * Returns a boolean indicating whether the expenditure is fully funded,
 * i.e. the balance of each token is greater than or equal to the sum of its payouts
 */
export const isExpenditureFullyFunded = (
  expenditure: ExpenditureFragment,
  newBalances: ExpenditureBalance[],
): boolean => {
  const slotAmountsByToken = expenditure.slots.flatMap((slot) => {
    const amounts: Array<{ tokenAddress: string; amount: BigNumber }> = [];

    slot.payouts?.forEach((payout) => {
      if (!payout.isClaimed) {
        const existingAmountIndex = amounts.findIndex(
          (item) => item.tokenAddress === payout.tokenAddress,
        );
        if (existingAmountIndex !== -1) {
          amounts[existingAmountIndex].amount = BigNumber.from(
            amounts[existingAmountIndex].amount ?? 0,
          ).add(payout.amount);
        } else {
          amounts.push({
            tokenAddress: payout.tokenAddress,
            amount: BigNumber.from(payout.amount),
          });
        }
      }
    });

    return amounts;
  });

  return slotAmountsByToken.every(({ tokenAddress, amount }) => {
    const tokenBalance = newBalances?.find(
      (balance) => balance.tokenAddress === tokenAddress,
    );

    return amount.lte(tokenBalance?.amount ?? 0);
  });
};
