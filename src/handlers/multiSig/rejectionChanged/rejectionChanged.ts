import { MultiSigVote } from '~graphql';
import { getChainId } from '~provider';
import { ContractEvent } from '~types';
import {
  addMultiSigVote,
  getMultiSigDatabaseId,
  getUserMultiSigSignature,
  removeMultiSigVote,
} from '../helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: multiSigExtensionAddress, colonyAddress } = event;
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
