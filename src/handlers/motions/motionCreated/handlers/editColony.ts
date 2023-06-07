import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleEditColonyMotion = async (
  event: ContractEvent,
  { name }: TransactionDescription,
): Promise<void> => {
  const { transactionHash, contractAddress: colonyAddress } = event;
  const pendingColonyMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );
  await createMotionInDB(event, {
    type: motionNameMapping[name],
    pendingColonyMetadataId,
  });
};
