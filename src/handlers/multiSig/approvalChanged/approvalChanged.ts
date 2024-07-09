import { ExtensionEventListener } from '~eventListeners';
import { MultiSigVote } from '~graphql';
import { getChainId } from '~provider';
import { EventHandler } from '~types';
import {
  addMultiSigVote,
  getMultiSigDatabaseId,
  getUserMultiSigSignature,
  removeMultiSigVote,
} from '../helpers';

export const handleMultiSigApprovalChanged: EventHandler = async (
  event,
  listener,
) => {
  const { contractAddress: multiSigExtensionAddress } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

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
    vote: MultiSigVote.Approve,
    role,
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
        vote: MultiSigVote.Approve,
      });
    }
  }
};
