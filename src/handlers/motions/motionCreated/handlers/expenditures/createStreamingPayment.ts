import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';

import { createMotionInDB } from '../../helpers';
import { getPendingMetadataDatabaseId } from '~utils';

export default async (
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress, transactionHash } = event;
  const [, , , , domainId, , , , recipientAddress] = actionArgs;

  if (!colonyAddress) {
    return;
  }

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    recipientAddress,
    fromDomainId: domainId.toString(),
    gasEstimate: gasEstimate.toString(),
    pendingStreamingPaymentMetadataId: getPendingMetadataDatabaseId(
      colonyAddress,
      transactionHash,
    ),
  });
};
