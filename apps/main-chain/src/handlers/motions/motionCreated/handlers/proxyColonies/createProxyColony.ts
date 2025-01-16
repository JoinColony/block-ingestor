import { TransactionDescription } from 'ethers/lib/utils';
import { createMotionInDB } from '../../helpers';
import { ContractEvent } from '@joincolony/blocks';
import { motionNameMapping } from '~types';

export const handleCreateProxyColonyMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { _destinationChainId: destinationChainId } = parsedAction.args;
  if (!destinationChainId) {
    return;
  }

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[parsedAction.name],
    targetChainId: destinationChainId.toNumber(),
    multiChainInfo: {
      completed: false,
    },
  });
};
