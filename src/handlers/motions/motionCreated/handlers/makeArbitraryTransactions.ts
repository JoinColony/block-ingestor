import { TransactionDescription } from 'ethers/lib/utils';
import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId } from '~utils';

import { createMotionInDB } from '../helpers';

export const handleMakeArbitraryTransactionsMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress } = event;

  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const [recipients] = actionArgs;

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    recipientAddress: recipients[0],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    gasEstimate: gasEstimate.toString(),
  });
};
