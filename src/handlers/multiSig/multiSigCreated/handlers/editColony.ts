import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMultiSigInDB } from '../helpers';

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
  await createMultiSigInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    pendingColonyMetadataId,
  });
};
