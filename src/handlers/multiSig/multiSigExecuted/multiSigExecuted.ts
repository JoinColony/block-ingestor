import { ExtensionEventListener } from '~eventListeners';
import { getChainId } from '~provider';

import { EventHandler } from '~types';
// import { linkPendingMetadata } from '~utils/colonyMetadata';

import {
  getMultiSigDatabaseId,
  getMultiSigFromDB,
  updateMultiSigInDB,
} from '../helpers';
import { getMultiSigClient, verbose } from '~utils';
import { linkPendingMetadata } from '~utils/colonyMetadata';

export const handleMultiSigMotionExecuted: EventHandler = async (
  event,
  listener,
) => {
  const {
    contractAddress: multiSigExtensionAddress,
    args: { motionId, success, agent: userAddress },
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
    const multiSigClient = await getMultiSigClient(colonyAddress);

    if (!multiSigClient) {
      return;
    }

    const motion = await multiSigClient.getMotion(motionId);

    const actionData = motion.data[0];

    if (!actionData) {
      verbose(`No action data in multiSig motion: ${motionId}`);

      return;
    }

    await linkPendingMetadata(
      actionData,
      colonyAddress,
      finalizedMultiSig.id,
      true,
    );

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
      executedBy: userAddress,
      isExecuted: true,
      hasActionCompleted: success,
    };

    await updateMultiSigInDB(updatedMultiSigData);
  }
};
