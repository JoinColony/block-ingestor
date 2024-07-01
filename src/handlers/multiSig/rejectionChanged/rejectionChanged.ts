import { MultiSigVote } from '~graphql';
import { getChainId } from '~provider';
import { EventHandler } from '~types';
import {
  addMultiSigVote,
  getMultiSigDatabaseId,
  getUserMultiSigSignature,
  removeMultiSigVote,
} from '../helpers';
import { ExtensionEventListener } from '~eventListeners';

export const handleMultiSigRejectionChanged: EventHandler = async (
  event,
  listener,
) => {
  const { contractAddress: multiSigExtensionAddress } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

  if (!colonyAddress) {
    return;
  }

  const chainId = getChainId();
  const { agent: userAddress, motionId, role, approval } = event.args;

  const multiSigId = getMultiSigDatabaseId(
    chainId,
    multiSigExtensionAddress,
    motionId,
  );

  const existingVote = await getUserMultiSigSignature({
    multiSigId,
    userAddress,
    vote: MultiSigVote.Reject,
  });

  if (!approval) {
    if (existingVote) {
      await removeMultiSigVote(existingVote?.id);
    }
  } else {
    if (!existingVote) {
      await addMultiSigVote({
        multiSigId,
        role,
        userAddress,
        colonyAddress,
        vote: MultiSigVote.Reject,
      });
    }
  }
};
