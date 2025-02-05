import { TransactionDescription } from 'ethers/lib/utils';
import { multiSigNameMapping } from '~types';
import { ContractEvent } from '@joincolony/blocks';
import { createMultiSigInDB } from '../../helpers';

export const handleCreateProxyColonyMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { args, name } = parsedAction;

  const { _destinationChainId: destinationChainId } = args;

  if (!destinationChainId) {
    return;
  }

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    targetChainId: destinationChainId.toNumber(),
  });
};
