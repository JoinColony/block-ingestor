import { AnyColonyClient } from '@colony/colony-js';
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
  isColonyAddress,
  createFundsClaim,
} from '~utils';

const PAYOUT_CLAIMED_SIGNATURE_HASH = utils.id(
  ContractEventsSignatures.PayoutClaimed,
);

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
  const { contractAddress: extensionAddress } = oneTxPaymentEvent;

  const { data } =
    (await query<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>(
      GetColonyExtensionDocument,
      { id: extensionAddress },
    )) ?? {};
  const { colonyId: colonyAddress = '', version } =
    data?.getColonyExtension ?? {};

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  switch (version) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      handlerV1ToV5(oneTxPaymentEvent, colonyAddress, colonyClient);
      break;
    case 6:
      handlerV6(oneTxPaymentEvent, colonyAddress, colonyClient);
      break;
  }
};

const handlerV1ToV5 = async (
  event: ContractEvent,
  colonyAddress: string,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const [initiatorAddress, paymentOrExpenditureId, nPayments] = event.args;
  const receipt = await provider.getTransactionReceipt(event.transactionHash);

  if ((nPayments as BigNumber).eq(1)) {
    const [payoutClaimedLog] = receipt.logs.filter(
      (log) => PAYOUT_CLAIMED_SIGNATURE_HASH === log.topics[0],
    );

    const payoutClaimedEvent = await mapLogToContractEvent(
      payoutClaimedLog,
      colonyClient.interface,
    );

    if (!payoutClaimedEvent) {
      return;
    }

    const { recipient: recipientAddress, domainId } =
      await colonyClient.getPayment(paymentOrExpenditureId);

    const recipientIsColony = await isColonyAddress(recipientAddress);

    const { token: tokenAddress, amount } = payoutClaimedEvent.args;

    if (recipientIsColony) {
      await createFundsClaim({
        colonyAddress: recipientAddress,
        tokenAddress,
        amount: amount.toString(),
        event,
      });
    }

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.Payment,
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(domainId)),
      tokenAddress,
      amount: amount.toString(),
      initiatorAddress,
      recipientAddress,
      paymentId: toNumber(paymentOrExpenditureId),
    });
  } else {
    // @ts-expect-error
    const expenditure: Expenditure = await colonyClient.getExpenditure(
      paymentOrExpenditureId,
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

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.MultiplePayment,
      fromDomainId: getDomainDatabaseId(
        colonyAddress,
        toNumber(expenditure.domainId),
      ),
      initiatorAddress,
      paymentId: toNumber(paymentOrExpenditureId),
      payments,
    });
  }
};

const handlerV6 = async (
  event: ContractEvent,
  colonyAddress: string,
  colonyClient: AnyColonyClient,
): Promise<void> => {
  const [initiatorAddress, expenditureId] = event.args;
  const receipt = await provider.getTransactionReceipt(event.transactionHash);

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

  await writeActionFromEvent(event, colonyAddress, actionFields);
};
