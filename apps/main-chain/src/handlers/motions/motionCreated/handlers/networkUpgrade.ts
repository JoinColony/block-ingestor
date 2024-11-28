import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';
import { toNumber } from '~utils';

import { createMotionInDB } from '../helpers';

export const handleNetworkUpgradeMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { name, args: actionArgs } = parsedAction;
  const newVersion = actionArgs[0];
  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    newColonyVersion: toNumber(newVersion),
  });
};
