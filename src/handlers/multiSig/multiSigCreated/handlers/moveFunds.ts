import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import {
  getCachedColonyClient,
  getDomainDatabaseId,
  getExpenditureByFundingPot,
  isDomainFromFundingPotSupported,
  toNumber,
} from '~utils';
import { createMultiSigInDB } from '../helpers';
import { BigNumber } from 'ethers';
import { sendMultisigActionNotifications } from '~utils/notifications';
import { NotificationCategory } from '~types/notifications';
import { NotificationType } from '~graphql';
import { fundExpenditureMultisigHandler } from './multipleFunctionsHandlers/fundExpenditure';

export const handleMoveFundsMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const {
    args: { agent: initiatorAddress },
    blockNumber,
    transactionHash,
  } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  const colonyVersion = await colonyClient.version({ blockTag: blockNumber });

  // There are two moveFundsBetweenPots actions, one pre colony version 7 and one post.
  let fromPot: BigNumber,
    toPot: BigNumber,
    amount: BigNumber,
    tokenAddress: string;

  const isOldVersion = colonyVersion.lte(6);
  if (isOldVersion) {
    [, , , fromPot, toPot, amount, tokenAddress] = actionArgs;
  } else {
    [, , , , , fromPot, toPot, amount, tokenAddress] = actionArgs;
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

  // Check if the target pot belongs to an expenditure
  const targetExpenditure = await getExpenditureByFundingPot(
    colonyAddress,
    toNumber(toPot),
  );

  // This is an edge case, if we send over just 1 recipient when making an advanced payment, the fund expenditure multisig will end up here
  // therefor, if we have an expenditure, we assume we are processing a fundExpenditure multisig
  if (targetExpenditure) {
    await fundExpenditureMultisigHandler({
      event,
      colonyAddress,
      decodedFunctions: [parsedAction],
    });
  } else {
    await createMultiSigInDB(colonyAddress, event, {
      type: multiSigNameMapping[name],
      tokenAddress,
      amount: amount.toString(),
      fromDomainId: fromDomainId
        ? getDomainDatabaseId(colonyAddress, toNumber(fromDomainId))
        : undefined,
      toDomainId: toDomainId
        ? getDomainDatabaseId(colonyAddress, toNumber(toDomainId))
        : undefined,
    });

    await sendMultisigActionNotifications({
      colonyAddress,
      creator: initiatorAddress,
      notificationCategory: NotificationCategory.Payment,
      notificationType: NotificationType.MultisigActionCreated,
      transactionHash,
    });
  }
};
