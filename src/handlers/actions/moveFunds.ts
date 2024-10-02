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
  ExpenditureFragment,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { mutate } from '~amplifyClient';
import { sendActionNotifications } from '~utils/notifications';

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
    await updateExpenditureBalances(targetExpenditure, tokenAddress, amount);
  }

  if (!hasOneTxPaymentEvent) {
    sendActionNotifications({
      creator: initiatorAddress,
      colonyAddress,
      transactionHash,
    });
  }
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
