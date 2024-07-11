import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { createMultiSigInDB } from '../helpers';
import { getDomainDatabaseId, getPendingMetadataDatabaseId } from '~utils';

export const handleAddOrEditDomainMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;

  const domainId = actionArgs[2];

  const fromDomainId = getDomainDatabaseId(colonyAddress, domainId);

  const pendingDomainMetadataId = getPendingMetadataDatabaseId(
    colonyAddress,
    event.transactionHash,
  );

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    pendingDomainMetadataId,
    fromDomainId,
  });
};
