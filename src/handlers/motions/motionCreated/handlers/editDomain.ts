import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId, getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleEditDomainMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { transactionHash, colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args } = parsedAction;
  const [, , nativeDomainId] = args;

  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    pendingDomainMetadataId,
    fromDomainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
    gasEstimate: gasEstimate.toString(),
  });
};
