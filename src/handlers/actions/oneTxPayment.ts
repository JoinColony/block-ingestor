import { BigNumber, utils } from 'ethers';
import { query } from '~amplifyClient';
import {
  ColonyActionType,
  GetColonyExtensionDocument,
  GetColonyExtensionQuery,
  GetColonyExtensionQueryVariables,
} from '~graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getCachedColonyClient,
  getDomainDatabaseId,
  mapLogToContractEvent,
  notNull,
  toNumber,
  writeActionFromEvent,
  ActionFields,
} from '~utils';

const EXPENDITURE_PAYOUT_SET = utils.id(
  ContractEventsSignatures.ExpenditurePayoutSet,
);

enum ExpenditureStatus {
  Draft,
  Cancelled,
  Finalized,
  Locked,
}

interface Expenditure {
  status: ExpenditureStatus;
  owner: string;
  fundingPotId: BigNumber;
  domainId: BigNumber;
  finalizedTimestamp: BigNumber;
  globalClaimDelay: BigNumber;
}

interface ExpenditureSlot {
  recipient: string;
  claimDelay: BigNumber;
  payoutModifier: BigNumber;
  skills: BigNumber[];
}

export interface MultiPayment {
  amount: string;
  tokenAddress: string;
  recipientAddress: string;
}

export default async (oneTxPaymentEvent: ContractEvent): Promise<void> => {
  const {
    contractAddress: extensionAddress,
    transactionHash,

    args,
  } = oneTxPaymentEvent;

  const { data } =
    (await query<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>(
      GetColonyExtensionDocument,
      { id: extensionAddress },
    )) ?? {};

  const colonyAddress = data?.getColonyExtension?.colonyId ?? '';
  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const [initiatorAddress, expenditureId] = args;
  const receipt = await provider.getTransactionReceipt(transactionHash);

  // multiple OneTxPayments use expenditures at the contract level
  // @ts-expect-error
  const expenditure: Expenditure = await colonyClient.getExpenditure(
    expenditureId,
  );

  const expenditurePayoutLogs = receipt.logs.filter((log) =>
    log.topics.includes(EXPENDITURE_PAYOUT_SET),
  );

  const expenditurePayoutEvents = await Promise.all(
    expenditurePayoutLogs.map((log) =>
      mapLogToContractEvent(log, colonyClient.interface),
    ),
  );

  const payments: MultiPayment[] = await Promise.all(
    expenditurePayoutEvents.filter(notNull).map(async ({ args }) => {
      const [, expenditureId, slotId, tokenAddress, amount] = args;
      const expenditureSlot: ExpenditureSlot =
        // @ts-expect-error
        await colonyClient.getExpenditureSlot(expenditureId, slotId);

      const payment: MultiPayment = {
        amount: amount.toString(),
        tokenAddress,
        recipientAddress: expenditureSlot.recipient,
      };
      return payment;
    }),
  );

  const hasMultiplePayments = payments.length > 1;
  let actionFields: ActionFields = {
    type: hasMultiplePayments
      ? ColonyActionType.MultiplePayment
      : ColonyActionType.Payment,
    fromDomainId: getDomainDatabaseId(
      colonyAddress,
      toNumber(expenditure.domainId),
    ),
    initiatorAddress,
  };

  if (payments.length === 1) {
    const { tokenAddress, amount, recipientAddress } = payments[0];
    actionFields = {
      ...actionFields,
      tokenAddress,
      amount,
      recipientAddress,
      paymentId: toNumber(expenditureId),
    };
  } else {
    actionFields = {
      ...actionFields,
      paymentId: toNumber(expenditureId),
      payments,
    };
  }

  await writeActionFromEvent(oneTxPaymentEvent, colonyAddress, actionFields);
};
