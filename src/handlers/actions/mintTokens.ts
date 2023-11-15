import { Id } from '@colony/colony-js';

import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import {
  writeActionFromEvent,
  getColonyTokenAddress,
  getDomainDatabaseId,
  verbose,
  createFundsClaim,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
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

    await createFundsClaim({
      colonyAddress,
      tokenAddress,
      amount: amount.toString(),
      event,
    });
  } else {
    verbose(
      `Detected Mint Tokens event but its amount was ${
        amount ? amount.toString() : amount
      }`,
    );
  }
};
