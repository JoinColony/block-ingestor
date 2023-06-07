import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleManageDomainMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { transactionHash, contractAddress: colonyAddress } = event;
  const { name } = parsedAction;
  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    pendingDomainMetadataId,
  });
};
