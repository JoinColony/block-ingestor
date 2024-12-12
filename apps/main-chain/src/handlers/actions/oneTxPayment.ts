import { AnyColonyClient } from '@colony/colony-js';
import { BigNumber, utils } from 'ethers';
import { query } from '~amplifyClient';
import {
  ColonyActionType,
  GetColonyExtensionDocument,
  GetColonyExtensionQuery,
  GetColonyExtensionQueryVariables,
} from '@joincolony/graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import { NotificationCategory } from '~types/notifications';
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
import { getAmountLessFee, getNetworkInverseFee } from '~utils/networkFee';
import { sendPermissionsActionNotifications } from '~utils/notifications';

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
  networkFee?: string;
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

  const networkInverseFee = await getNetworkInverseFee();
  if (!networkInverseFee) {
    return;
  }

  switch (version) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      handlerV1ToV5(
        oneTxPaymentEvent,
        colonyAddress,
        colonyClient,
        networkInverseFee,
      );
      break;
    case 6:
      handlerV6(
        oneTxPaymentEvent,
        colonyAddress,
        colonyClient,
        networkInverseFee,
      );
      break;
    default:
      handlerV6(
        oneTxPaymentEvent,
        colonyAddress,
        colonyClient,
        networkInverseFee,
      );
      break;
  }
};

const handlerV1ToV5 = async (
  event: ContractEvent,
  colonyAddress: string,
  colonyClient: AnyColonyClient,
  networkFee: string,
): Promise<void> => {
  const { blockNumber } = event;
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
      await colonyClient.getPayment(paymentOrExpenditureId, {
        blockTag: blockNumber,
      });

    const recipientIsColony = await isColonyAddress(recipientAddress);

    const { token: tokenAddress, amount } = payoutClaimedEvent.args;

    const amountLessFee = getAmountLessFee(amount, networkFee);
    const fee = BigNumber.from(amount).sub(amountLessFee);

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
      amount: amountLessFee.toString(),
      networkFee: fee.toString(),
      initiatorAddress,
      recipientAddress,
      paymentId: toNumber(paymentOrExpenditureId),
    });
  } else {
    const expenditure: Expenditure = await colonyClient.getExpenditure(
      paymentOrExpenditureId,
      { blockTag: blockNumber },
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
          await colonyClient.getExpenditureSlot(expenditureId, slotId, {
            blockTag: blockNumber,
          });

        const amountLessFee = getAmountLessFee(amount, networkFee);
        const fee = BigNumber.from(amount).sub(amountLessFee);

        const payment: MultiPayment = {
          amount: amount.toString(),
          networkFee: fee.toString(),
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
  networkFee: string,
): Promise<void> => {
  const { blockNumber, transactionHash } = event;
  const [initiatorAddress, expenditureId] = event.args;
  const receipt = await provider.getTransactionReceipt(event.transactionHash);

  // multiple OneTxPayments use expenditures at the contract level
  const expenditure: Expenditure = await colonyClient.getExpenditure(
    expenditureId,
    { blockTag: blockNumber },
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
        await colonyClient.getExpenditureSlot(expenditureId, slotId, {
          blockTag: blockNumber,
        });

      const amountLessFee = getAmountLessFee(amount, networkFee);
      const fee = BigNumber.from(amount).sub(amountLessFee);

      const payment: MultiPayment = {
        amount: amountLessFee.toString(),
        networkFee: fee.toString(),
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
    const { tokenAddress, amount, recipientAddress, networkFee } = payments[0];
    actionFields = {
      ...actionFields,
      tokenAddress,
      amount,
      networkFee,
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

  const firstPaymentData = payments?.[0];
  if (firstPaymentData) {
    sendPermissionsActionNotifications({
      mentions: [firstPaymentData.recipientAddress],
      creator: initiatorAddress,
      colonyAddress,
      transactionHash,
      notificationCategory: NotificationCategory.Payment,
    });
  }
};
