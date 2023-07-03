import { utils } from 'ethers';
import { mutate } from '~amplifyClient';
import {
  ColonyActionType,
  CreateColonyFundsClaimDocument,
  CreateColonyFundsClaimMutation,
  CreateColonyFundsClaimMutationVariables,
} from '~graphql';
import networkClient from '~networkClient';

import provider, { getChainId } from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  writeActionFromEvent,
  getOneTxPaymentContract,
  toNumber,
  mapLogToContractEvent,
  getDomainDatabaseId,
  getCachedColonyClient,
} from '~utils';

const events = [
  ContractEventsSignatures.PaymentAdded,
  ContractEventsSignatures.PayoutClaimed,
  ContractEventsSignatures.OneTxPaymentMade,
];

const hashedSignatures = events.map((signature) => utils.id(signature));

export default async (paymentAddedEvent: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    transactionHash,
    logIndex,
    blockNumber,
  } = paymentAddedEvent;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

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
  const { recipient: recipientAddress, domainId } =
    await colonyClient.getPayment(paymentId);

  const recipientIsColony = await networkClient.isColony(recipientAddress);

  const { token: tokenAddress, amount } = payoutClaimedEvent.args;
  const [initiatorAddress, fundamentalChainId] = oneTxPaymentMadeEvent.args;

  if (recipientIsColony) {
    const chainId = getChainId();
    const claimId = `${chainId}_${transactionHash}_${logIndex}`;

    await mutate<
      CreateColonyFundsClaimMutation,
      CreateColonyFundsClaimMutationVariables
    >(CreateColonyFundsClaimDocument, {
      input: {
        id: claimId,
        colonyFundsClaimsId: recipientAddress,
        colonyFundsClaimTokenId: tokenAddress,
        createdAtBlock: blockNumber,
        amount: amount.toString(),
      },
    });
  }

  await writeActionFromEvent(paymentAddedEvent, colonyAddress, {
    type: ColonyActionType.Payment,
    fromDomainId: getDomainDatabaseId(colonyAddress, toNumber(domainId)),
    tokenAddress,
    amount: amount.toString(),
    initiatorAddress,
    recipientAddress,
    fundamentalChainId: toNumber(fundamentalChainId),
  });
};
