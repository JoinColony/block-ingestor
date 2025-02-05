import { MultiSigVote } from '@joincolony/graphql';
import rpcProvider from '~provider';
import {
  addMultiSigVote,
  getMultiSigDatabaseId,
  getUserMultiSigSignature,
  removeMultiSigVote,
} from '../helpers';
import { EventHandler, ExtensionEventListener } from '@joincolony/blocks';

export const handleMultiSigRejectionChanged: EventHandler = async (
  event,
  listener,
) => {
  const { contractAddress: multiSigExtensionAddress, timestamp } = event;

  const { colonyAddress } = listener as ExtensionEventListener;

  if (!colonyAddress) {
    return;
  }

  const chainId = rpcProvider.getChainId();
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
        vote: MultiSigVote.Reject,
        timestamp,
      });
    }
  }
};
