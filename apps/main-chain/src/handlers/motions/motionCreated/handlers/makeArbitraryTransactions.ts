import { TransactionDescription } from 'ethers/lib/utils';
import { Id } from '@colony/colony-js';
import { motionNameMapping } from '~types';
import { getDomainDatabaseId } from '~utils';

import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleMakeArbitraryTransactionsMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const [recipients] = actionArgs;

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    recipientAddress: recipients[0],
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
