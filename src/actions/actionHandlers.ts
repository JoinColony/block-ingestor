import { Id } from '@colony/colony-js';

import { ColonyActionType } from '~graphql';
import { NotificationCategory } from '~types/notifications';
import {
  writeActionFromEvent,
  getColonyTokenAddress,
  getDomainDatabaseId,
  verbose,
} from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';
import { ActionHandler } from './types';

export const handleMintTokensAction: ActionHandler = async (events) => {
  const { contractAddress: colonyAddress, transactionHash } = events[0];
  const {
    agent: initiatorAddress,
    who: recipientAddress,
    amount,
  } = events[0].args;

  const tokenAddress = await getColonyTokenAddress(colonyAddress);

  if (!tokenAddress) {
    verbose(`Unable to find ERC20 token address for colony: ${colonyAddress}`);
    return;
  }

  if (amount && amount.toString() !== '0') {
    await writeActionFromEvent(events[0], colonyAddress, {
      type: ColonyActionType.MintTokens,
      initiatorAddress,
      recipientAddress,
      amount: amount.toString(),
      tokenAddress,
      fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    });

    sendPermissionsActionNotifications({
      creator: initiatorAddress,
      colonyAddress,
      transactionHash,
      notificationCategory: NotificationCategory.Payment,
    });
  } else {
    verbose(
      `Detected Mint Tokens event but its amount was ${
        amount ? amount.toString() : amount
      }`,
    );
  }
};
