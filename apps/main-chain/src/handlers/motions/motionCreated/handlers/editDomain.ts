import { TransactionDescription } from 'ethers/lib/utils';
import { motionNameMapping } from '~types';
import { getDomainDatabaseId, getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleEditDomainMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { transactionHash } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args } = parsedAction;
  const [, , nativeDomainId] = args;

  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    pendingDomainMetadataId,
    fromDomainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
  });
};
