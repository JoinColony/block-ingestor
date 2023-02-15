import { utils } from 'ethers';

import networkClient from '~/networkClient';
import provider from '~/provider';
import {
  ColonyActionType,
  ContractEvent,
  ContractEventsSignatures,
} from '~/types';
import {
  writeActionFromEvent,
  getOneTxPaymentContract,
  toNumber,
  mapLogToContractEvent,
} from '~/utils';

const events = [
  ContractEventsSignatures.PaymentAdded,
  ContractEventsSignatures.PayoutClaimed,
  ContractEventsSignatures.OneTxPaymentMade,
];

const hashedSignatures = events.map((signature) => utils.id(signature));

export default async (paymentAddedEvent: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = paymentAddedEvent;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  const receipt = await provider.getTransactionReceipt(transactionHash);
  const [, payoutClaimedLog, oneTxPaymentMadeLog] = receipt.logs.filter((log) =>
    hashedSignatures.includes(log.topics[0] as ContractEventsSignatures),
  );

  const payoutClaimedEvent = await mapLogToContractEvent(
    payoutClaimedLog,
    colonyClient.interface,
  );

  const extensionAddress = oneTxPaymentMadeLog.address;
  const oneTxPaymentContract = getOneTxPaymentContract(extensionAddress);
  const oneTxPaymentMadeEvent = await mapLogToContractEvent(
    oneTxPaymentMadeLog,
    oneTxPaymentContract.interface,
  );

  if (!payoutClaimedEvent || !oneTxPaymentMadeEvent) {
    return;
  }

  const { paymentId } = paymentAddedEvent.args;
  const { domainId } = await colonyClient.getPayment(paymentId);
  const { token: tokenAddress, amount } = payoutClaimedEvent.args;
  const [recipientAddress, fundamentalChainId] = oneTxPaymentMadeEvent.args;

  await writeActionFromEvent(paymentAddedEvent, colonyAddress, {
    type: ColonyActionType.Payment,
    fromDomain: domainId.toString(),
    tokenAddress,
    amount: amount.toString(),
    initiatorAddress: extensionAddress,
    recipientAddress,
    fundamentalChainId: toNumber(fundamentalChainId),
  });
};
