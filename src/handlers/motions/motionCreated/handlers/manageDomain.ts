import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getPendingMotionDomainDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleManageDomainMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { transactionHash, contractAddress: colonyAddress } = event;
  const { name } = parsedAction;
  const pendingDomainMetadataId = getPendingMotionDomainDatabaseId(
    colonyAddress,
    transactionHash,
  );

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    pendingDomainMetadataId,
  });
};
