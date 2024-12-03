import { Id } from '@colony/colony-js';

import { ColonyActionType } from '@joincolony/graphql';
import { verbose } from '@joincolony/utils';
import { ContractEvent } from '@joincolony/blocks';
import { NotificationCategory } from '~types/notifications';
import {
  writeActionFromEvent,
  getColonyTokenAddress,
  getDomainDatabaseId,
} from '~utils';
import { sendPermissionsActionNotifications } from '~utils/notifications';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { agent: initiatorAddress, who: recipientAddress, amount } = event.args;

  const tokenAddress = await getColonyTokenAddress(colonyAddress);

  if (!tokenAddress) {
    verbose(`Unable to find ERC20 token address for colony: ${colonyAddress}`);
    return;
  }

  if (amount && amount.toString() !== '0') {
    await writeActionFromEvent(event, colonyAddress, {
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
