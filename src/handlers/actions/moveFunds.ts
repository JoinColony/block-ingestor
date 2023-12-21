import { BigNumber, utils } from 'ethers';

import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  toNumber,
  writeActionFromEvent,
  getDomainDatabaseId,
  verbose,
  getCachedColonyClient,
  isDomainFromFundingPotSupported,
} from '~utils';
import provider from '~provider';
import { ColonyActionType } from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const receipt = await provider.getTransactionReceipt(event.transactionHash);
  const oneTxPaymentEvent = receipt.logs.some((log) =>
    log.topics.includes(utils.id(ContractEventsSignatures.OneTxPaymentMade)),
  );

  if (oneTxPaymentEvent) {
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

  const colonyClient = await getCachedColonyClient(colonyAddress);
  let fromDomainId: BigNumber | undefined;
  let toDomainId: BigNumber | undefined;

  if (!colonyClient) {
    return;
  }

  if (isDomainFromFundingPotSupported(colonyClient)) {
    fromDomainId = await colonyClient.getDomainFromFundingPot(fromPot, {
      blockTag: blockNumber,
    });
    toDomainId = await colonyClient.getDomainFromFundingPot(toPot, {
      blockTag: blockNumber,
    });
  }

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
  });
};
