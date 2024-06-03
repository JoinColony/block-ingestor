import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import {
  getCachedColonyClient,
  getDomainDatabaseId,
  isDomainFromFundingPotSupported,
  toNumber,
} from '~utils';

import { createMotionInDB } from '../helpers';

export const handleMoveFundsMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { blockNumber } = event;

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

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    tokenAddress,
    amount: amount.toString(),
    fromDomainId: fromDomainId
      ? getDomainDatabaseId(colonyAddress, toNumber(fromDomainId))
      : undefined,
    toDomainId: toDomainId
      ? getDomainDatabaseId(colonyAddress, toNumber(toDomainId))
      : undefined,
    gasEstimate: gasEstimate.toString(),
  });
};
