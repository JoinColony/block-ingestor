import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, motionNameMapping } from '~types';
import { getPendingMetadataDatabaseId } from '~utils';
import { createMotionInDB } from '../helpers';

export const handleAddDomainMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { transactionHash, colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;

  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    transactionHash,
  );

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    pendingDomainMetadataId,
    gasEstimate: gasEstimate.toString(),
  });
};
