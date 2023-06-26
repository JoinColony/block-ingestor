import { Id } from '@colony/colony-js';
import { mutate } from '~amplifyClient';

import {
  ColonyActionType,
  CreateColonyFundsClaimDocument,
  CreateColonyFundsClaimMutation,
  CreateColonyFundsClaimMutationVariables,
} from '~graphql';
import { getChainId } from '~provider';
import { ContractEvent } from '~types';
import {
  writeActionFromEvent,
  getColonyTokenAddress,
  getDomainDatabaseId,
  verbose,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: colonyAddress,
    transactionHash,
    logIndex,
    blockNumber,
  } = event;
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

    const chainId = getChainId();
    const claimId = `${chainId}_${transactionHash}_${logIndex}`;

    await mutate<
      CreateColonyFundsClaimMutation,
      CreateColonyFundsClaimMutationVariables
    >(CreateColonyFundsClaimDocument, {
      input: {
        id: claimId,
        colonyFundsClaimsId: colonyAddress,
        colonyFundsClaimTokenId: tokenAddress,
        createdAtBlock: blockNumber,
        amount: amount.toString(),
      },
    });
  } else {
    verbose(
      `Detected Mint Tokens event but its amount was ${
        amount ? amount.toString() : amount
      }`,
    );
  }
};
