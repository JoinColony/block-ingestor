import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { createMultiSigInDB } from '../helpers';
import { getPendingMetadataDatabaseId } from '~utils';

export const handleAddOrEditDomainMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;

  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    event.transactionHash,
  );

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    pendingDomainMetadataId,
  });
};
