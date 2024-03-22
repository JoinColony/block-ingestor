import { BigNumber } from 'ethers';

import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  toNumber,
  writeActionFromEvent,
  getDomainDatabaseId,
  verbose,
  getCachedColonyClient,
  isDomainFromFundingPotSupported,
  getUpdatedExpenditureBalances,
  transactionHasEvent,
} from '~utils';
import {
  ColonyActionType,
  ExpenditureFragment,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate, query } from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const hasOneTxPaymentEvent = await transactionHasEvent(
    event.transactionHash,
    ContractEventsSignatures.OneTxPaymentMade,
  );

  if (hasOneTxPaymentEvent) {
    verbose(
      'Not acting upon the ColonyFundsMovedBetweenFundingPots event as a OneTxPayment event was present in the same transaction',
    );
    return;
  }

  const { contractAddress: colonyAddress, blockNumber } = event;
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

  if (targetExpenditure) {
    await updateExpenditureBalances(targetExpenditure, tokenAddress, amount);
  }
};

const getExpenditureByFundingPot = async (
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

const updateExpenditureBalances = async (
  expenditure: ExpenditureFragment,
  tokenAddress: string,
  amount: string,
): Promise<void> => {
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
};
