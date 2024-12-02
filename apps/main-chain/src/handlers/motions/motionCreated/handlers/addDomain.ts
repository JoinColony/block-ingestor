import { TransactionDescription } from 'ethers/lib/utils';
import { motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleAddDomainMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { transactionHash } = event;
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;

  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    pendingDomainMetadataId,
  });
};
