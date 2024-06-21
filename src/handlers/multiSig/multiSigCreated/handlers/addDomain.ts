import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { createMultiSigInDB } from '../helpers';

export const handleAddDomainMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
  });
};
