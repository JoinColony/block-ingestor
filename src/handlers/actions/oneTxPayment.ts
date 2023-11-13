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
  isColonyAddress,
  mapLogToContractEvent,
  notNull,
  toNumber,
  writeActionFromEvent,
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

  const [initiatorAddress, , nPayments] = args;
  const receipt = await provider.getTransactionReceipt(transactionHash);

  if ((nPayments as BigNumber).eq(1)) {
    const [, paymentId] = args;
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
      await colonyClient.getPayment(paymentId);

    const recipientIsColony = await isColonyAddress(recipientAddress);

    const { token: tokenAddress, amount } = payoutClaimedEvent.args;

    if (recipientIsColony) {
      await createFundsClaim({
        colonyAddress: recipientAddress,
        tokenAddress,
        amount: amount.toString(),
        event: oneTxPaymentEvent,
      });
    }

    await writeActionFromEvent(oneTxPaymentEvent, colonyAddress, {
      type: ColonyActionType.Payment,
      fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(domainId)),
      tokenAddress,
      amount: amount.toString(),
      initiatorAddress,
      recipientAddress,
      paymentId: toNumber(paymentId),
    });
  } else {
    // multiple OneTxPayments use expenditures at the contract level
    const [, expenditureId] = args;
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

    await writeActionFromEvent(oneTxPaymentEvent, colonyAddress, {
      type: ColonyActionType.MultiplePayment,
      fromDomainId: getDomainDatabaseId(
        colonyAddress,
        toNumber(expenditure.domainId),
      ),
      initiatorAddress,
      paymentId: toNumber(expenditureId),
      payments,
    });
  }
};
