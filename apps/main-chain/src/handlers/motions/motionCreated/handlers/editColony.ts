import { TransactionDescription } from 'ethers/lib/utils';
import { motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleEditColonyMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  { name }: TransactionDescription,
): Promise<void> => {
  const { transactionHash } = event;
  if (!colonyAddress) {
    return;
  }

  const pendingColonyMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );
  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    pendingColonyMetadataId,
  });
};
