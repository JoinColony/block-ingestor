import { TransactionDescription } from 'ethers/lib/utils';
import { multiSigNameMapping } from '~types';
import { createMultiSigInDB } from '../helpers';
import { toNumber } from '~utils';
import { ContractEvent } from '@joincolony/blocks';

export const handleColonyVersionUpgrade = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;

  const newColonyVersion = toNumber(actionArgs[0]);

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    newColonyVersion,
  });
};
