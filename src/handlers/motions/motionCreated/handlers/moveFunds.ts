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
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;

  const [, , , , , fromPot, toPot, amount, tokenAddress] = actionArgs;

  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  let fromDomainId: BigNumber | undefined;
  let toDomainId: BigNumber | undefined;

  if (isDomainFromFundingPotSupported(colonyClient)) {
    fromDomainId = await colonyClient.getDomainFromFundingPot(fromPot);
    toDomainId = await colonyClient.getDomainFromFundingPot(toPot);
  }

  await createMotionInDB(event, {
    type: motionNameMapping[name],
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
