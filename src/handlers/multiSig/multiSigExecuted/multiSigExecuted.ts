import { ExtensionEventListener } from '~eventListeners';
import { getChainId } from '~provider';

import { EventHandler } from '~types';
// import { linkPendingMetadata } from '~utils/colonyMetadata';

import {
  getMultiSigDatabaseId,
  getMultiSigFromDB,
  updateMultiSigInDB,
} from '../helpers';

export const handleMultiSigMotionExecuted: EventHandler = async (
  event,
  listener,
) => {
  const {
    contractAddress: multiSigExtensionAddress,
    args: { motionId, success },
    timestamp,
  } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

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

    // @NOTE failing execution is allowed only after 1 week so the motion doesn't end up floating around
    const updatedMultiSigData = {
      id: multiSigDatabaseId,
      executedAt: new Date(timestamp * 1000).toISOString(),
      ...(success ? { isExecuted: true } : { isRejected: true }),
    };

    await updateMultiSigInDB(updatedMultiSigData);
  }
};
