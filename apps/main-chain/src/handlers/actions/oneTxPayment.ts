import { AnyColonyClient } from '@colony/colony-js';
import { BigNumber, utils } from 'ethers';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  GetColonyExtensionDocument,
  GetColonyExtensionQuery,
  GetColonyExtensionQueryVariables,
} from '@joincolony/graphql';
import rpcProvider from '~provider';
import {
  ContractEvent,
  ContractEventsSignatures,
  ProxyColonyEvents,
} from '@joincolony/blocks';
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
import blockManager from '~blockManager';
import { getAndSyncMultiChainInfo } from '~utils/crossChain';

const PAYOUT_CLAIMED_SIGNATURE_HASH = utils.id(
  ContractEventsSignatures.PayoutClaimed,
);

const EXPENDITURE_PAYOUT_SET_OLD = utils.id(
  ContractEventsSignatures.ExpenditurePayoutSetOld,
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
  chainId?: string;
  tokenAddress: string;
  recipientAddress: string;
}

export default async (oneTxPaymentEvent: ContractEvent): Promise<void> => {
  const { contractAddress: extensionAddress } = oneTxPaymentEvent;

  const { data } =
    (await amplifyClient.query<
      GetColonyExtensionQuery,
      GetColonyExtensionQueryVariables
    >(GetColonyExtensionDocument, { id: extensionAddress })) ?? {};
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
    case 7:
    case 8:
    case 9:
      handlerV6ToV9(
        oneTxPaymentEvent,
        colonyAddress,
        colonyClient,
        networkInverseFee,
      );
      break;
    default:
      handlerV10(
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
  const receipt = await rpcProvider
    .getProviderInstance()
    .getTransactionReceipt(event.transactionHash);

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
      log.topics.includes(EXPENDITURE_PAYOUT_SET_OLD),
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

const handlerV6ToV9 = async (
  event: ContractEvent,
  colonyAddress: string,
  colonyClient: AnyColonyClient,
  networkFee: string,
): Promise<void> => {
  const { blockNumber, transactionHash } = event;
  const [initiatorAddress, expenditureId] = event.args;
  const receipt = await rpcProvider
    .getProviderInstance()
    .getTransactionReceipt(event.transactionHash);

  // multiple OneTxPayments use expenditures at the contract level
  const expenditure: Expenditure = await colonyClient.getExpenditure(
    expenditureId,
    { blockTag: blockNumber },
  );

  const expenditurePayoutLogs = receipt.logs.filter((log) =>
    log.topics.includes(EXPENDITURE_PAYOUT_SET_OLD),
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

const PAYOUT_CLAIMED = utils.id(
  ContractEventsSignatures.ExpenditurePayoutClaimedNew,
);
export const PAYOUT_CLAIMED_INTERFACE = new utils.Interface([
  'event PayoutClaimed(address agent, uint256 id, uint256 slot, uint256 chainId, address token, uint256 tokenPayout)',
]);

const handlerV10 = async (
  event: ContractEvent,
  colonyAddress: string,
  colonyClient: AnyColonyClient,
  networkFee: string,
): Promise<void> => {
  const { blockNumber, transactionHash } = event;
  const [initiatorAddress, expenditureId] = event.args;
  const receipt = await rpcProvider
    .getProviderInstance()
    .getTransactionReceipt(event.transactionHash);

  // multiple OneTxPayments use expenditures at the contract level
  const expenditure: Expenditure = await colonyClient.getExpenditure(
    expenditureId,
    { blockTag: blockNumber },
  );

  const paymentClaimedLogs = receipt.logs.filter((log) =>
    log.topics.includes(PAYOUT_CLAIMED),
  );

  const payoutClaimedEvents = await Promise.all(
    paymentClaimedLogs.map((log) =>
      blockManager.mapLogToContractEvent(log, PAYOUT_CLAIMED_INTERFACE),
    ),
  );

  const payments: MultiPayment[] = await Promise.all(
    payoutClaimedEvents.filter(notNull).map(async ({ args }) => {
      const [, expenditureId, slotId, chainId, tokenAddress, amount] = args;
      const expenditureSlot: ExpenditureSlot =
        await colonyClient.getExpenditureSlot(expenditureId, slotId, {
          blockTag: blockNumber,
        });

      const amountLessFee = getAmountLessFee(amount, networkFee);
      const fee = BigNumber.from(amount).sub(amountLessFee);

      const payment: MultiPayment = {
        amount: amountLessFee.toString(),
        networkFee: fee.toString(),
        chainId,
        tokenAddress,
        recipientAddress: expenditureSlot.recipient,
      };
      return payment;
    }),
  );

  // this is assuming the following:
  // the simple payment action only has 1 recipient anyways, so we can use that chainId for the action one
  // if we have multiple, then the UI needs to get it from the payments array

  const firstPaymentData = payments?.[0];
  const targetChainId = firstPaymentData?.chainId
    ? firstPaymentData.chainId
    : rpcProvider.getChainId();

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

  // we only do cross chain action completion for simple payments, since multi payment need to be done per payout
  if (payments.length === 1) {
    let multiChainInfoId;

    if (targetChainId !== rpcProvider.getChainId()) {
      const wormholeLogs = receipt.logs.filter((log) =>
        log.topics.includes(
          utils.id(ContractEventsSignatures.LogMessagePublished),
        ),
      );

      const wormholeEvents = await Promise.all(
        wormholeLogs.map((log) =>
          blockManager.mapLogToContractEvent(log, ProxyColonyEvents),
        ),
      );

      const wormholeEvent = wormholeEvents[0];
      if (wormholeEvent) {
        multiChainInfoId = await getAndSyncMultiChainInfo(
          wormholeEvent,
          transactionHash,
          Number(targetChainId),
        );
      }
    }

    const { tokenAddress, amount, recipientAddress, networkFee } = payments[0];
    actionFields = {
      ...actionFields,
      tokenAddress,
      amount,
      networkFee,
      recipientAddress,
      paymentId: toNumber(expenditureId),
      targetChainId: Number(targetChainId),
      multiChainInfoId,
    };
  } else {
    actionFields = {
      ...actionFields,
      paymentId: toNumber(expenditureId),
      payments,
    };
  }

  await writeActionFromEvent(event, colonyAddress, actionFields);

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
