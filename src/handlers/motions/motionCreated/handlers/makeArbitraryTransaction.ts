import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';

import { createMotionInDB } from '../helpers';

export const handleMakeArbitraryTransactionMotion = async (
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
  });
};
