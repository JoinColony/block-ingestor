import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleEditColonyMotion = async (
  event: ContractEvent,
  { name }: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { transactionHash, colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const pendingColonyMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );
  await createMotionInDB(event, {
    type: motionNameMapping[name],
    pendingColonyMetadataId,
    gasEstimate: gasEstimate.toString(),
  });
};
