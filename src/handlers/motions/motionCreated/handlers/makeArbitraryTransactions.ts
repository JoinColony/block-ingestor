import { TransactionDescription } from 'ethers/lib/utils';
import { Id } from '@colony/colony-js';

import { ContractEvent, motionNameMapping } from '~types';

import { createMotionInDB } from '../helpers';
import { getDomainDatabaseId } from '~utils';

export const handleMakeArbitraryTransactionsMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
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
  });
};
