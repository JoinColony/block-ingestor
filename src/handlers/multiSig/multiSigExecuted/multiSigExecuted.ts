import { getChainId } from '~provider';

import { ContractEvent } from '~types';
// import { linkPendingMetadata } from '~utils/colonyMetadata';

import {
  getMultiSigDatabaseId,
  getMultiSigFromDB,
  updateMultiSigInDB,
} from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const {
    contractAddress: multiSigExtensionAddress,
    colonyAddress,
    args: { motionId, success },
    timestamp,
  } = event;

  if (!colonyAddress) {
    return;
  }

  const chainId = getChainId();
  const multiSigDatabaseId = getMultiSigDatabaseId(
    chainId,
    multiSigExtensionAddress,
    motionId,
  );
  const finalizedMultiSig = await getMultiSigFromDB(multiSigDatabaseId);

  if (finalizedMultiSig) {
    /* @TODO fix this up when we start porting over domain motions
     * the action string is not an event argument like it's for motions, so we may need to tweak linkPendingMetadata a bit
    await linkPendingMetadata(
      action,
      colonyAddress,
      finalizedMultiSig.id,
      true,
    );
    */

    const updatedMultiSigData = {
      id: multiSigDatabaseId,
      isSuccess: success,
      isExecuted: true,
      executedAt: new Date(timestamp * 1000).toISOString(),
    };

    await updateMultiSigInDB(updatedMultiSigData);
  }
};
